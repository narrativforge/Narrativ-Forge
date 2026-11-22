"""Multi-Track Hybrid Video Composer for Narrativ Forge.

Enables assembling external AI video clips (Runway, Kling, Luma Dream Machine, Sora, Pika)
with multi-track dubbing, BGM auto-ducking, SFX, and dynamic anime-styled subtitles.
"""

from __future__ import annotations

import uuid
from dataclasses import dataclass, field
from enum import Enum
from typing import Any, Dict, List, Optional


class TransitionType(str, Enum):
    CUT = "cut"
    FADE_TO_BLACK = "fade_to_black"
    CROSS_DISSOLVE = "cross_dissolve"
    WHIP_PAN = "whip_pan"
    ANIME_FLASH = "anime_flash"


class VideoSourceProvider(str, Enum):
    RUNWAY_GEN3 = "runway_gen3"
    KLING_AI = "kling_ai"
    LUMA_DREAM = "luma_dream_machine"
    OPENAI_SORA = "openai_sora"
    PIKA = "pika_labs"
    LOCAL_UPLOAD = "local_upload"
    CUSTOM_URL = "custom_url"


@dataclass
class VideoClip:
    id: str
    source_url: str
    provider: VideoSourceProvider
    title: str
    start_trim_seconds: float = 0.0
    duration_seconds: float = 5.0
    speed_factor: float = 1.0
    transition_in: TransitionType = TransitionType.CUT
    transition_duration_seconds: float = 0.5

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "source_url": self.source_url,
            "provider": self.provider.value,
            "title": self.title,
            "start_trim_seconds": self.start_trim_seconds,
            "duration_seconds": self.duration_seconds,
            "effective_duration_seconds": round(self.duration_seconds / max(self.speed_factor, 0.1), 2),
            "speed_factor": self.speed_factor,
            "transition_in": self.transition_in.value,
            "transition_duration_seconds": self.transition_duration_seconds,
        }


@dataclass
class AudioTrackCue:
    id: str
    track_type: str  # "dubbing", "bgm", "sfx"
    audio_url: str
    start_time_seconds: float
    duration_seconds: float
    volume_percent: float = 100.0
    auto_duck_on_speech: bool = False
    voice_binding: Optional[Dict[str, str]] = None

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "track_type": self.track_type,
            "audio_url": self.audio_url,
            "start_time_seconds": self.start_time_seconds,
            "duration_seconds": self.duration_seconds,
            "volume_percent": self.volume_percent,
            "auto_duck_on_speech": self.auto_duck_on_speech,
            "voice_binding": self.voice_binding,
        }


@dataclass
class SubtitleCue:
    id: str
    text: str
    start_time_seconds: float
    end_time_seconds: float
    speaker: Optional[str] = None
    style: str = "anime_pop"  # "anime_pop", "cinematic_bold", "classic_yellow", "minimal_white"

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "text": self.text,
            "start_time_seconds": self.start_time_seconds,
            "end_time_seconds": self.end_time_seconds,
            "duration_seconds": round(self.end_time_seconds - self.start_time_seconds, 2),
            "speaker": self.speaker,
            "style": self.style,
        }


class VideoComposerService:
    """Service for assembling multi-track timelines and exporting video jobs."""

    @classmethod
    def register_external_clip(
        cls,
        source_url: str,
        provider: VideoSourceProvider,
        title: str,
        duration_seconds: float = 5.0,
    ) -> Dict[str, Any]:
        """Validate and create metadata for an external AI video clip."""
        clip_id = f"clip_{uuid.uuid4().hex[:8]}"
        clip = VideoClip(
            id=clip_id,
            source_url=source_url,
            provider=provider,
            title=title,
            duration_seconds=duration_seconds,
        )
        return clip.to_dict()

    @classmethod
    def build_timeline(
        cls,
        title: str,
        video_clips: List[Dict[str, Any]],
        dubbing_cues: Optional[List[Dict[str, Any]]] = None,
        bgm_track_url: Optional[str] = None,
        bgm_volume_percent: float = 30.0,
        sfx_cues: Optional[List[Dict[str, Any]]] = None,
        subtitles: Optional[List[Dict[str, Any]]] = None,
        target_aspect_ratio: str = "9:16",
    ) -> Dict[str, Any]:
        """Assemble all tracks into an aligned timeline ready for rendering."""
        timeline_id = f"tl_{uuid.uuid4().hex[:8]}"

        # Calculate video sequence timings
        processed_video_track = []
        current_video_time = 0.0

        for raw_clip in video_clips:
            duration = float(raw_clip.get("duration_seconds", 5.0))
            speed = float(raw_clip.get("speed_factor", 1.0))
            effective_duration = round(duration / max(speed, 0.1), 2)

            clip_entry = {
                **raw_clip,
                "timeline_start": round(current_video_time, 2),
                "timeline_end": round(current_video_time + effective_duration, 2),
                "effective_duration": effective_duration,
            }
            processed_video_track.append(clip_entry)
            current_video_time += effective_duration

        total_video_duration = round(current_video_time, 2)

        # Assemble BGM Track
        audio_tracks = []
        if bgm_track_url:
            audio_tracks.append({
                "id": f"bgm_{uuid.uuid4().hex[:6]}",
                "track_type": "bgm",
                "audio_url": bgm_track_url,
                "start_time_seconds": 0.0,
                "duration_seconds": total_video_duration,
                "volume_percent": bgm_volume_percent,
                "auto_duck_on_speech": True,
            })

        # Assemble Dubbing Cues
        if dubbing_cues:
            for cue in dubbing_cues:
                audio_tracks.append({
                    "id": cue.get("id", f"dub_{uuid.uuid4().hex[:6]}"),
                    "track_type": "dubbing",
                    "audio_url": cue.get("audio_url", ""),
                    "start_time_seconds": cue.get("start_time_seconds", 0.0),
                    "duration_seconds": cue.get("duration_seconds", 2.0),
                    "volume_percent": cue.get("volume_percent", 100.0),
                    "voice_binding": cue.get("voice_binding"),
                })

        # Assemble SFX Cues
        if sfx_cues:
            for sfx in sfx_cues:
                audio_tracks.append({
                    "id": sfx.get("id", f"sfx_{uuid.uuid4().hex[:6]}"),
                    "track_type": "sfx",
                    "audio_url": sfx.get("audio_url", ""),
                    "start_time_seconds": sfx.get("start_time_seconds", 0.0),
                    "duration_seconds": sfx.get("duration_seconds", 1.0),
                    "volume_percent": sfx.get("volume_percent", 90.0),
                })

        # Assemble Subtitle Track
        processed_subtitles = subtitles or []

        return {
            "timeline_id": timeline_id,
            "title": title,
            "aspect_ratio": target_aspect_ratio,
            "total_duration_seconds": total_video_duration,
            "tracks": {
                "video": processed_video_track,
                "audio": audio_tracks,
                "subtitles": processed_subtitles,
            },
            "status": "ready_for_render",
            "render_preset": {
                "resolution": "1080x1920" if target_aspect_ratio == "9:16" else "1920x1080",
                "fps": 30,
                "audio_bitrate": "192k",
                "video_codec": "libx264",
            },
        }

    TRAVEL_THEMES = {
        "lofi_sunset": {
            "name": "Lo-Fi Sunset Chill",
            "bpm": 85,
            "beat_interval": 0.71,
            "vibe": "Dreamy & Warm",
            "default_bgm_url": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/lofi_sunset.mp3",
            "recommended_color": "golden_hour",
        },
        "epic_adventure": {
            "name": "Epic Cinematic Wanderlust",
            "bpm": 120,
            "beat_interval": 0.50,
            "vibe": "Majestic & Grand",
            "default_bgm_url": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/epic_travel.mp3",
            "recommended_color": "teal_and_orange",
        },
        "tropical_breeze": {
            "name": "Tropical Island Breeze",
            "bpm": 104,
            "beat_interval": 0.58,
            "vibe": "Sunny & Upbeat",
            "default_bgm_url": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/tropical.mp3",
            "recommended_color": "vibrant_paradise",
        },
        "velocity_cyber": {
            "name": "Fast City Velocity",
            "bpm": 130,
            "beat_interval": 0.46,
            "vibe": "Modern & High Energy",
            "default_bgm_url": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/velocity.mp3",
            "recommended_color": "cinematic_moody",
        },
    }

    COLOR_PRESETS = {
        "teal_and_orange": {
            "name": "Teal & Orange",
            "description": "Blockbuster contrast with cyan shadows and warm skin tones",
            "ffmpeg_filter": "colorbalance=rs=0.08:gs=-0.02:bs=-0.08:rm=-0.05:gm=0.02:bm=0.08,eq=contrast=1.12:saturation=1.2",
        },
        "golden_hour": {
            "name": "Golden Hour",
            "description": "Warm sunset glow and gentle highlight roll-off",
            "ffmpeg_filter": "colorbalance=rs=0.14:gs=0.05:bs=-0.12,eq=contrast=1.08:saturation=1.15:gamma=1.04",
        },
        "vintage_film": {
            "name": "35mm Vintage Film",
            "description": "Kodak film aesthetic with lifted blacks and nostalgic tone",
            "ffmpeg_filter": "curves=preset=vintage,eq=contrast=1.1:saturation=1.1",
        },
        "vibrant_paradise": {
            "name": "Vibrant Paradise",
            "description": "Deep sky blues, vivid emerald greens and crisp clarity",
            "ffmpeg_filter": "eq=contrast=1.15:saturation=1.35:brightness=0.02",
        },
        "cinematic_moody": {
            "name": "Cinematic Moody",
            "description": "High contrast, crushed blacks and muted atmospheric tones",
            "ffmpeg_filter": "eq=contrast=1.25:saturation=0.88:brightness=-0.04",
        },
    }

    @classmethod
    def get_travel_presets(cls) -> Dict[str, Any]:
        """Return available music themes and cinematic color grade presets."""
        return {
            "themes": [
                {"id": k, **v} for k, v in cls.TRAVEL_THEMES.items()
            ],
            "color_grades": [
                {"id": k, **v} for k, v in cls.COLOR_PRESETS.items()
            ],
        }

    @classmethod
    def generate_smart_travel_reel(
        cls,
        raw_clips: List[Dict[str, Any]],
        location_badge: str = "Bagan, Myanmar",
        theme_id: str = "epic_adventure",
        color_grade_id: str = "teal_and_orange",
        target_duration_seconds: float = 30.0,
        enable_speed_ramps: bool = True,
    ) -> Dict[str, Any]:
        """Auto-compose raw travel footage into a beat-synced 9:16 cinematic reel."""
        if not raw_clips:
            raise ValueError("At least one raw video clip is required to generate a travel reel")

        theme = cls.TRAVEL_THEMES.get(theme_id, cls.TRAVEL_THEMES["epic_adventure"])
        color_preset = cls.COLOR_PRESETS.get(color_grade_id, cls.COLOR_PRESETS["teal_and_orange"])
        beat_interval = theme["beat_interval"]
        bar_duration = round(beat_interval * 4, 2)  # 4-beat bar

        # Calculate optimal slice per clip to hit target duration
        num_clips = len(raw_clips)
        target_per_clip = max(target_duration_seconds / num_clips, bar_duration)

        composed_clips = []
        transitions = [
            TransitionType.CUT,
            TransitionType.WHIP_PAN,
            TransitionType.CROSS_DISSOLVE,
            TransitionType.ANIME_FLASH,
        ]

        current_time = 0.0
        for i, clip in enumerate(raw_clips):
            clip_title = clip.get("title", f"Scene {i+1}")
            source_url = clip.get("source_url", "")
            raw_duration = float(clip.get("duration_seconds", target_per_clip))

            # Alternate speed ramping: 1.35x movement -> 0.65x slow-mo peak
            speed = 1.0
            if enable_speed_ramps:
                speed = 0.65 if (i % 2 == 1) else 1.35

            shot_duration = min(raw_duration, target_per_clip)
            effective_duration = round(shot_duration / speed, 2)
            transition = transitions[i % len(transitions)] if i > 0 else TransitionType.CUT

            composed_clips.append({
                "id": f"travel_shot_{i+1:02d}",
                "title": clip_title,
                "source_url": source_url,
                "provider": VideoSourceProvider.LOCAL_UPLOAD.value,
                "start_trim_seconds": float(clip.get("start_trim_seconds", 0.0)),
                "duration_seconds": shot_duration,
                "speed_factor": speed,
                "transition_in": transition.value,
                "transition_duration_seconds": 0.4 if transition != TransitionType.CUT else 0.0,
                "color_filter": color_preset["ffmpeg_filter"],
            })
            current_time += effective_duration

        total_reel_duration = round(current_time, 2)

        # Generate animated title badge cue
        title_badge = {
            "text": location_badge,
            "start_time_seconds": 0.5,
            "duration_seconds": 3.5,
            "style": {
                "font_size": 42,
                "font_color": "#ffffff",
                "box_color": "rgba(0,0,0,0.55)",
                "position": "bottom_center",
                "animation": "fade_in_slide_up",
            },
        }

        # Build base timeline
        timeline = cls.build_timeline(
            title=f"Travel Reel - {location_badge}",
            video_clips=composed_clips,
            bgm_track_url=theme["default_bgm_url"],
            bgm_volume_percent=65.0,
            subtitles=[title_badge],
            target_aspect_ratio="9:16",
        )

        timeline["travel_metadata"] = {
            "location_badge": location_badge,
            "theme": theme["name"],
            "bpm": theme["bpm"],
            "color_grade": color_preset["name"],
            "speed_ramps_enabled": enable_speed_ramps,
            "total_shots": len(composed_clips),
            "estimated_render_time_seconds": round(total_reel_duration * 0.4, 1),
        }

        # Generate complete FFmpeg execution script
        cmd = [
            "ffmpeg",
            "-y",
            "-f", "concat",
            "-safe", "0",
            "-i", "inputs.txt",
            "-i", theme["default_bgm_url"],
            "-vf", f"scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,{color_preset['ffmpeg_filter']}",
            "-c:v", "libx264",
            "-preset", "fast",
            "-crf", "22",
            "-c:a", "aac",
            "-b:a", "192k",
            "-shortest",
            f"travel_reel_{uuid.uuid4().hex[:6]}.mp4",
        ]
        timeline["ffmpeg_command"] = " ".join(cmd)

        return timeline
