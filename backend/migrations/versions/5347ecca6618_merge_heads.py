"""merge heads

Revision ID: 5347ecca6618
Revises: bc8b9dcfbe50, update_application_sqlite
Create Date: 2025-10-26 10:26:14.110905

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "5347ecca6618"
down_revision: Union[str, None] = ("bc8b9dcfbe50", "update_application_sqlite")
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
