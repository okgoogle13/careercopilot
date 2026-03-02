<<<<<<< HEAD
from datetime import datetime
from typing import Any, Dict, Optional
from sqlalchemy import JSON, String, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column
from .database import Base, BaseMixin

=======
from typing import Any

from sqlalchemy import JSON, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column

from .database import Base, BaseMixin


>>>>>>> restoration-KR-Rage-Figma-v2.0
class UserAsset(Base, BaseMixin):
    """SQLAlchemy model for user assets (resumes, KSC, voice profiles).
    Replaces Firestore users/{user_id}/assetLibrary collection.
    """
    __tablename__ = "user_assets"

    user_id: Mapped[str] = mapped_column(String(255), ForeignKey("users.id"), nullable=False, index=True)
    document_type: Mapped[str] = mapped_column(String(50), nullable=False) # resume, ksc, voice
<<<<<<< HEAD
    
    # Store the complex extracted data as JSONB
    extracted_data: Mapped[Dict[str, Any]] = mapped_column(JSON, nullable=False)
    
    # Contextual tags
    role_type: Mapped[str] = mapped_column(String(255), nullable=False)
    subsectors: Mapped[list[str]] = mapped_column(JSON, default=list)
    
=======

    # Store the complex extracted data as JSONB
    extracted_data: Mapped[dict[str, Any]] = mapped_column(JSON, nullable=False)

    # Contextual tags
    role_type: Mapped[str] = mapped_column(String(255), nullable=False)
    subsectors: Mapped[list[str]] = mapped_column(JSON, default=list)

>>>>>>> restoration-KR-Rage-Figma-v2.0
    # Metadata
    file_name: Mapped[str] = mapped_column(String(512), nullable=False)
    file_type: Mapped[str] = mapped_column(String(100), nullable=False)
    storage_uri: Mapped[str] = mapped_column(String(1024), nullable=False)
<<<<<<< HEAD
    file_size_bytes: Mapped[Optional[int]] = mapped_column(nullable=True)
    
    schema_version: Mapped[str] = mapped_column(String(20), default="v4")
    
=======
    file_size_bytes: Mapped[int | None] = mapped_column(nullable=True)

    schema_version: Mapped[str] = mapped_column(String(20), default="v4")

>>>>>>> restoration-KR-Rage-Figma-v2.0
    def __repr__(self) -> str:
        return f"<UserAsset {self.document_type} for user {self.user_id}>"
