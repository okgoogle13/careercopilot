"""cleanup before application update

Revision ID: bc8b9dcfbe50
Revises: 39448280638b
Create Date: 2025-10-26 10:33:00.000000

"""

from collections.abc import Sequence

from alembic import op

# revision identifiers, used by Alembic.
revision: str = "bc8b9dcfbe50"
down_revision: str | None = "39448280638b"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def has_table(table_name):
    # Helper function to check if a table exists
    from sqlalchemy import text

    conn = op.get_bind()
    result = conn.execute(
        text("SELECT name FROM sqlite_master WHERE type='table' AND name = :name"),
        {"name": table_name},
    ).fetchall()
    return len(result) > 0


def upgrade() -> None:
    # Drop the agent_messages_new table if it exists from a previous failed migration
    if has_table("agent_messages_new"):
        op.drop_table("agent_messages_new")


def downgrade() -> None:
    # No need to do anything in downgrade for a cleanup migration
    pass
