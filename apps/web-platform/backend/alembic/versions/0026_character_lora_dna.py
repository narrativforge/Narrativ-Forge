"""Add lora_tag and face_reference_url to character_registry.

Revision ID: 0026_character_lora_dna
Revises: 0025_usage_event_org_idempotency
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy import inspect

revision: str = "0026_character_lora_dna"
down_revision: Union[str, Sequence[str], None] = "0025_usage_event_org_idempotency"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    bind = op.get_bind()
    inspector = inspect(bind)
    if inspector.has_table("character_registry"):
        columns = [c["name"] for c in inspector.get_columns("character_registry")]
        if "lora_tag" not in columns:
            op.add_column(
                "character_registry",
                sa.Column("lora_tag", sa.String(length=300), nullable=True),
            )
        if "face_reference_url" not in columns:
            op.add_column(
                "character_registry",
                sa.Column("face_reference_url", sa.String(length=1000), nullable=True),
            )


def downgrade() -> None:
    bind = op.get_bind()
    inspector = inspect(bind)
    if inspector.has_table("character_registry"):
        columns = [c["name"] for c in inspector.get_columns("character_registry")]
        if "face_reference_url" in columns:
            op.drop_column("character_registry", "face_reference_url")
        if "lora_tag" in columns:
            op.drop_column("character_registry", "lora_tag")
