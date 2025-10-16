"""
Database configuration and connection management.
Supports PostgreSQL (production) and SQLite (development/testing).
"""

import logging
import os
from contextlib import contextmanager
from typing import Generator

from app.models.database import Base
from sqlalchemy import create_engine, event, text
from sqlalchemy.orm import Session, sessionmaker
from sqlalchemy.pool import StaticPool

logger = logging.getLogger(__name__)


class DatabaseConfig:
    """Database configuration management"""

    def __init__(self):
        self.database_url = self._get_database_url()
        self.is_sqlite = "sqlite" in self.database_url
        self.is_postgresql = "postgresql" in self.database_url

        # Engine configuration
        engine_kwargs = {
            "echo": os.getenv("DB_ECHO", "false").lower() == "true",
            "pool_pre_ping": True,
        }

        if self.is_sqlite:
            engine_kwargs.update(
                {"poolclass": StaticPool, "connect_args": {"check_same_thread": False}}
            )
        elif self.is_postgresql:
            engine_kwargs.update(
                {
                    "pool_size": int(os.getenv("DB_POOL_SIZE", "5")),
                    "max_overflow": int(os.getenv("DB_MAX_OVERFLOW", "10")),
                    "pool_timeout": int(os.getenv("DB_POOL_TIMEOUT", "30")),
                }
            )

        self.engine = create_engine(self.database_url, **engine_kwargs)

        # Enable WAL mode for SQLite
        if self.is_sqlite:

            @event.listens_for(self.engine, "connect")
            def set_sqlite_pragma(dbapi_connection, connection_record):
                cursor = dbapi_connection.cursor()
                cursor.execute("PRAGMA journal_mode=WAL")
                cursor.execute("PRAGMA synchronous=NORMAL")
                cursor.execute("PRAGMA cache_size=1000")
                cursor.execute("PRAGMA temp_store=MEMORY")
                cursor.close()

        self.SessionLocal = sessionmaker(
            autocommit=False, autoflush=False, bind=self.engine
        )

    def _get_database_url(self) -> str:
        """Determine database URL based on environment"""

        # Check for explicit database URL
        if db_url := os.getenv("DATABASE_URL"):
            return db_url

        # Check for PostgreSQL connection parameters
        if all(
            os.getenv(key) for key in ["DB_HOST", "DB_NAME", "DB_USER", "DB_PASSWORD"]
        ):
            host = os.getenv("DB_HOST")
            port = os.getenv("DB_PORT", "5432")
            name = os.getenv("DB_NAME")
            user = os.getenv("DB_USER")
            password = os.getenv("DB_PASSWORD")
            return f"postgresql://{user}:{password}@{host}:{port}/{name}"

        # Default to SQLite for development
        db_path = os.getenv("SQLITE_DB_PATH", "data/careercopilot.db")
        os.makedirs(os.path.dirname(db_path), exist_ok=True)
        return f"sqlite:///{db_path}"

    def create_tables(self):
        """Create all database tables"""
        try:
            Base.metadata.create_all(bind=self.engine)
            logger.info(
                f"Database tables created successfully using {self.database_url}"
            )
        except Exception as e:
            logger.error(f"Failed to create database tables: {e}")
            raise

    def drop_tables(self):
        """Drop all database tables (use with caution!)"""
        try:
            Base.metadata.drop_all(bind=self.engine)
            logger.warning("All database tables dropped")
        except Exception as e:
            logger.error(f"Failed to drop database tables: {e}")
            raise


# Global database configuration
db_config = DatabaseConfig()


def get_db() -> Generator[Session, None, None]:
    """FastAPI dependency for database sessions"""
    db = db_config.SessionLocal()
    try:
        yield db
    finally:
        db.close()


@contextmanager
def get_db_session() -> Generator[Session, None, None]:
    """Context manager for database sessions"""
    db = db_config.SessionLocal()
    try:
        yield db
        db.commit()
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()


def init_database():
    """Initialize database (create tables if needed)"""
    try:
        db_config.create_tables()
        logger.info("Database initialized successfully")
    except Exception as e:
        logger.error(f"Database initialization failed: {e}")
        raise


# Health check for database connectivity
def check_database_health() -> dict:
    """Check database connectivity and return status"""
    try:
        with get_db_session() as db:
            # Simple query to test connection
            db.execute(text("SELECT 1"))
            return {
                "status": "healthy",
                "database_type": "sqlite" if db_config.is_sqlite else "postgresql",
                "url": (
                    db_config.database_url.split("@")[-1]
                    if "@" in db_config.database_url
                    else db_config.database_url
                ),
            }
    except Exception as e:
        return {
            "status": "unhealthy",
            "error": str(e),
            "database_type": "sqlite" if db_config.is_sqlite else "postgresql",
        }
