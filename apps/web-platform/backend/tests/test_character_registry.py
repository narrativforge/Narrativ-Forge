from types import SimpleNamespace

import pytest
from fastapi import HTTPException

from app.api.routes.characters import (
    CharacterImportBatch,
    CharacterImportPayload,
    import_avatar_character,
    import_avatar_character_batch,
    list_narrativ_characters,
)
from app.api.routes.manga import MangaGenerateRequest, generate_manga_storyboard
from app.models import CharacterRegistry, Organization
from app.services.manga_engine import LayoutType, MangaEngine

pytestmark = pytest.mark.unit


def payload(
    actor_id: str,
    actor_name: str | None = None,
    lora_tag: str | None = None,
    face_reference_url: str | None = None,
) -> CharacterImportPayload:
    return CharacterImportPayload(
        actor_id=actor_id,
        actor_name=actor_name or actor_id.title(),
        voice_binding={"engine": "edge-tts", "voice_id": "my-MM-NilarNeural"},
        expression_map={"happy": "smile"},
        character_meta={"source": "test"},
        lora_tag=lora_tag,
        face_reference_url=face_reference_url,
    )


def test_character_registry_persists_payload_after_session_refresh(db_session):
    organization = Organization(name="Character Workspace", slug="character-workspace")
    db_session.add(organization)
    db_session.commit()
    membership = SimpleNamespace(organization_id=organization.id)

    result = import_avatar_character(payload("actor-1", "Actor One"), membership, None, db_session)
    assert result["status"] == "imported"

    db_session.expire_all()
    characters = list_narrativ_characters(membership, db_session)
    assert len(characters) == 1
    assert characters[0]["actor_id"] == "actor-1"
    assert characters[0]["actor_name"] == "Actor One"
    assert characters[0]["voice_binding"]["voice_id"] == "my-MM-NilarNeural"
    assert characters[0]["expression_map"] == {"happy": "smile"}
    assert characters[0]["character_meta"] == {"source": "test"}
    assert db_session.query(CharacterRegistry).count() == 1


def test_character_registry_persists_lora_tag_and_face_reference(db_session):
    organization = Organization(name="LoRA Workspace", slug="lora-workspace")
    db_session.add(organization)
    db_session.commit()
    membership = SimpleNamespace(organization_id=organization.id)

    lora_dna = "<lora:hero_aung:0.85> aung_character"
    face_ref = "https://storage.nexus/faces/aung_snapshot.png"

    result = import_avatar_character(
        payload("aung-hero", "Aung Hero", lora_tag=lora_dna, face_reference_url=face_ref),
        membership,
        None,
        db_session,
    )
    assert result["status"] == "imported"

    db_session.expire_all()
    characters = list_narrativ_characters(membership, db_session)
    assert len(characters) == 1
    assert characters[0]["actor_id"] == "aung-hero"
    assert characters[0]["lora_tag"] == lora_dna
    assert characters[0]["face_reference_url"] == face_ref


def test_character_registry_isolated_by_organization(db_session):
    org_a = Organization(name="Workspace A", slug="character-a")
    org_b = Organization(name="Workspace B", slug="character-b")
    db_session.add_all([org_a, org_b])
    db_session.commit()
    membership_a = SimpleNamespace(organization_id=org_a.id)
    membership_b = SimpleNamespace(organization_id=org_b.id)

    import_avatar_character(payload("shared-actor"), membership_a, None, db_session)
    assert [item["actor_id"] for item in list_narrativ_characters(membership_a, db_session)] == ["shared-actor"]
    assert list_narrativ_characters(membership_b, db_session) == []

    result = import_avatar_character(payload("shared-actor", "Workspace B Actor"), membership_b, None, db_session)
    assert result["status"] == "imported"
    assert [item["actor_name"] for item in list_narrativ_characters(membership_b, db_session)] == ["Workspace B Actor"]


def test_character_batch_skips_duplicate_actor_ids_without_losing_other_packs(db_session):
    organization = Organization(name="Batch Workspace", slug="character-batch")
    db_session.add(organization)
    db_session.commit()
    membership = SimpleNamespace(organization_id=organization.id)

    batch = CharacterImportBatch(packs=[payload("actor-a"), payload("actor-b"), payload("actor-a", "Duplicate A")])
    result = import_avatar_character_batch(batch, membership, None, db_session)

    assert result["imported"] == 2
    assert result["skipped"] == 1
    assert {item["actor_id"] for item in list_narrativ_characters(membership, db_session)} == {"actor-a", "actor-b"}


def test_character_registry_rejects_vrm_path_traversal(db_session):
    organization = Organization(name="Path Workspace", slug="character-path")
    db_session.add(organization)
    db_session.commit()
    membership = SimpleNamespace(organization_id=organization.id)
    unsafe = CharacterImportPayload(actor_id="unsafe", actor_name="Unsafe", vrm_model_path="/models/../../private.vrm")

    with pytest.raises(HTTPException) as exc:
        import_avatar_character(unsafe, membership, None, db_session)
    assert exc.value.status_code == 422


def test_manga_engine_injects_character_lora_tags():
    lora_map = {
        "Shinji": "<lora:shinji_mech:0.85> shinji_uniform",
        "Sakura": "<lora:sakura_idol:0.90> sakura_dress",
    }
    page = MangaEngine.generate_manga_page(
        title="Neo Tokyo Mission",
        story_synopsis="Shinji and Sakura pilot their mechas into orbit",
        layout_type=LayoutType.YONKOMA_4KOMA,
        character_names=["Shinji", "Sakura"],
        character_lora_tags=lora_map,
    )
    assert page["total_panels"] == 4
    for panel in page["panels"]:
        prompt = panel["visual_prompt"]
        assert "<lora:" in prompt


def test_manga_route_auto_resolves_character_registry_lora(db_session):
    organization = Organization(name="LoRA Manga Org", slug="lora-manga-org")
    db_session.add(organization)
    db_session.commit()
    membership = SimpleNamespace(organization_id=organization.id)

    lora_dna = "<lora:shinji_pilot:0.85> shinji_pilot"
    import_avatar_character(
        payload("shinji-actor", "Shinji", lora_tag=lora_dna),
        membership,
        None,
        db_session,
    )

    req = MangaGenerateRequest(
        title="Episode 1 Awakening",
        story_synopsis="Shinji activates the quantum drive",
        layout_type=LayoutType.WEBTOON_VERTICAL,
        characters=["Shinji"],
    )
    result = generate_manga_storyboard(req, membership, None, db_session)
    assert result["total_panels"] == 4
    for panel in result["panels"]:
        assert lora_dna in panel["visual_prompt"]
