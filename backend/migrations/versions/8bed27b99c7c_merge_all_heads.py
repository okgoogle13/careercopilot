"""merge all heads

Revision ID: 8bed27b99c7c
Revises: 5347ecca6618, ea364f0feefd
Create Date: 2025-10-26 10:28:33.617248

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "8bed27b99c7c"
down_revision: Union[str, None] = ("5347ecca6618", "ea364f0feefd")
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
