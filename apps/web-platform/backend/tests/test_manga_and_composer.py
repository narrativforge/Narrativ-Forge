from __future__ import annotations

import pytest
from types import SimpleNamespace
from app.main import app
from app.api.dependencies import get_current_membership, get_current_user
from app.services.manga_engine import MangaEngine, LayoutType, MANGA_SFX_CATALOG
from app.services.video_composer import VideoComposerService, VideoSourceProvider, TransitionType
from tests.client_utils import create_test_client

client = create_test_client(app)


def test_manga_engine_templates():
    templates = MangaEngine.get_layout_templates()
    assert len(templates) >= 4
    template_ids = [t["id"] for t in templates]
    assert LayoutType.WEBTOON_VERTICAL.value in template_ids
    assert LayoutType.YONKOMA_4KOMA.value in template_ids
    assert LayoutType.CINEMATIC_SPLASH.value in template_ids


def test_manga_engine_generate_4koma():
    page = MangaEngine.generate_manga_page(
        title="Epic Mech Awakening",
        story_synopsis="A young pilot awakens the ancient titan mecha in neo-tokyo",
        layout_type=LayoutType.YONKOMA_4KOMA,
        character_names=["Shinji", "Sakura"],
    )
    assert page["total_panels"] == 4
    assert len(page["panels"]) == 4
    assert page["layout_type"] == LayoutType.YONKOMA_4KOMA.value

    # Check panel 3 has twist shout bubble and camera cue
    panel_3 = page["panels"][2]
    assert len(panel_3["bubbles"]) >= 1
    assert panel_3["bubbles"][0]["bubble_type"] == "shout"
    assert panel_3["camera_cue"]["action"] == "zoom_in"


def test_manga_engine_generate_cinematic_splash():
    page = MangaEngine.generate_manga_page(
        title="Final Dimension Slash",
        story_synopsis="Ren confronts the shadow beast with twin energy katanas",
        layout_type=LayoutType.CINEMATIC_SPLASH,
        character_names=["Ren Kurogane", "Shadow Beast"],
    )
    assert page["total_panels"] == 3
    hero_panel = page["panels"][0]
    assert hero_panel["aspect_ratio"] == "16:9"
    assert hero_panel["camera_cue"]["action"] == "camera_shake_and_zoom"


def test_compile_motion_comic():
    page = MangaEngine.generate_manga_page(
        title="Webtoon Prologue",
        story_synopsis="Meeting at the cyber cherry blossom gate",
        layout_type=LayoutType.WEBTOON_VERTICAL,
    )
    motion_comic = MangaEngine.compile_motion_comic_timeline(page)
    assert motion_comic["total_panels"] == 4
    assert len(motion_comic["timeline_cues"]) == 4
    assert motion_comic["total_duration_seconds"] > 0
    assert motion_comic["timeline_cues"][0]["start_time_seconds"] == 0.0


def test_manga_api_routes():
    res_templates = client.get("/api/v1/manga/templates")
    assert res_templates.status_code == 401

    gen_payload = {
        "title": "Bagan Fantasy Chronicles",
        "story_synopsis": "An ancient guardian discovers a floating pagoda in the sky",
        "layout_type": "webtoon_vertical",
        "characters": ["May Myat Noe", "Min Thar"],
    }
    res_gen = client.post("/api/v1/manga/generate", json=gen_payload)
    assert res_gen.status_code == 401


def test_video_composer_api_routes():
    # 1. List providers
    res_prov = client.get("/api/v1/video-composer/providers")
    assert res_prov.status_code == 401

    # 2. Register external clip
    import_payload = {
        "source_url": "https://storage.googleapis.com/sample_videos/kling_clip_01.mp4",
        "provider": "kling_ai",
        "title": "Kling Anime Action Sequence 01",
        "duration_seconds": 6.5,
    }
    res_import = client.post("/api/v1/video-composer/import-clip", json=import_payload)
    assert res_import.status_code == 401


def test_manga_and_video_composer_authorized_routes():
    """The public route guard must not prevent a valid editor workspace flow."""
    original_overrides = dict(app.dependency_overrides)
    app.dependency_overrides[get_current_membership] = lambda: SimpleNamespace(organization_id="test-org")
    app.dependency_overrides[get_current_user] = lambda: {"id": "user-1", "role": "editor", "organization_id": "test-org"}
    try:
        assert client.get("/api/v1/manga/templates").status_code == 200
        manga = client.post("/api/v1/manga/generate", json={
            "title": "Bagan Fantasy Chronicles",
            "story_synopsis": "An ancient guardian discovers a floating pagoda in the sky",
            "layout_type": "webtoon_vertical",
        })
        assert manga.status_code == 200
        assert manga.json()["total_panels"] == 4

        providers = client.get("/api/v1/video-composer/providers")
        assert providers.status_code == 200
        imported = client.post("/api/v1/video-composer/import-clip", json={
            "source_url": "https://example.test/clip.mp4",
            "provider": "kling_ai",
            "title": "Editor clip",
            "duration_seconds": 6.5,
        })
        assert imported.status_code == 200
        assert imported.json()["clip"]["provider"] == "kling_ai"

        # Travel Reel endpoints test
        presets = client.get("/api/v1/video-composer/travel-presets")
        assert presets.status_code == 200
        presets_data = presets.json()
        assert len(presets_data["themes"]) >= 4
        assert len(presets_data["color_grades"]) >= 5

        reel_payload = {
            "raw_clips": [
                {"title": "Sunset Pagoda", "source_url": "https://example.test/sunset.mp4", "duration_seconds": 6.0},
                {"title": "Hot Air Balloon Flight", "source_url": "https://example.test/balloon.mp4", "duration_seconds": 8.0},
                {"title": "Old City Temple Gate", "source_url": "https://example.test/gate.mp4", "duration_seconds": 5.5},
            ],
            "location_badge": "Bagan, Myanmar",
            "theme_id": "epic_adventure",
            "color_grade_id": "teal_and_orange",
            "target_duration_seconds": 15.0,
            "enable_speed_ramps": True,
        }
        reel_res = client.post("/api/v1/video-composer/travel-reel", json=reel_payload)
        assert reel_res.status_code == 200
        reel_data = reel_res.json()
        assert reel_data["status"] == "success"
        assert reel_data["timeline"]["travel_metadata"]["location_badge"] == "Bagan, Myanmar"
        assert len(reel_data["timeline"]["tracks"]["video"]) == 3
        assert "ffmpeg" in reel_data["timeline"]["ffmpeg_command"]
    finally:
        app.dependency_overrides.clear()
        app.dependency_overrides.update(original_overrides)


def test_video_composer_travel_reel_service():
    """Unit test for smart travel reel generation algorithm."""
    clips = [
        {"title": "Inle Lake Morning", "source_url": "inle.mp4", "duration_seconds": 7.0},
        {"title": "Floating Gardens", "source_url": "gardens.mp4", "duration_seconds": 9.0},
    ]
    timeline = VideoComposerService.generate_smart_travel_reel(
        raw_clips=clips,
        location_badge="Inle Lake, Shan State",
        theme_id="lofi_sunset",
        color_grade_id="golden_hour",
        target_duration_seconds=15.0,
        enable_speed_ramps=True,
    )
    assert timeline["title"] == "Travel Reel - Inle Lake, Shan State"
    assert timeline["travel_metadata"]["bpm"] == 85
    assert timeline["travel_metadata"]["color_grade"] == "Golden Hour"
    assert len(timeline["tracks"]["video"]) == 2
    # Check speed factor alternation
    assert timeline["tracks"]["video"][0]["speed_factor"] == 1.35
    assert timeline["tracks"]["video"][1]["speed_factor"] == 0.65

