"""
Database configuration and connection management.

This module is responsible for setting up and managing the database connection
for the application. It provides a flexible configuration that supports both
PostgreSQL for production environments and SQLite for development and testing,
determined by environment variables.

It includes:
- A `DatabaseConfig` class to encapsulate all database-related setup,
  including engine creation and session management.
- A FastAPI dependency (`get_db`) to provide database sessions to API endpoints.
- A context manager (`get_db_session`) for use in non-request contexts like
  scripts or background tasks.
- Utility functions for database initialization and health checks.
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
    """
    Manages database configuration, engine, and sessions.

    This class reads environment variables to determine the correct database
    URL and configures the SQLAlchemy engine with appropriate settings for
    either PostgreSQL or SQLite. It also handles the creation of a sessionmaker
    for generating new database sessions.
    """

    def __init__(self):
        """
        Initializes the database configuration.

        Sets up the database URL, creates the SQLAlchemy engine with
        environment-specific pooling and connection arguments, and configures
        the session factory. For SQLite, it enables WAL mode for better
        concurrency.
        """
        self.database_url = self._get_database_url()
        self.is_sqlite = "sqlite" in self.database_url
        self.is_postgresql = "postgresql" in self.database_url

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
        """
        Determines the appropriate database URL from environment variables.

        The selection process is prioritized as follows:
        1. `DATABASE_URL` environment variable.
        2. A full set of PostgreSQL variables (`DB_HOST`, `DB_NAME`, etc.).
        3. A fallback to a local SQLite database file (`careercopilot.db`).

        Returns:
            The configured database connection URL string.
        """
        if db_url := os.getenv("DATABASE_URL"):
            return db_url

        if all(os.getenv(key) for key in ["DB_HOST", "DB_NAME", "DB_USER", "DB_PASSWORD"]):
            host = os.getenv("DB_HOST")
            port = os.getenv("DB_PORT", "5432")
            name = os.getenv("DB_NAME")
            user = os.getenv("DB_USER")
            password = os.getenv("DB_PASSWORD")
            return f"postgresql://{user}:{password}@{host}:{port}/{name}"

        db_path = os.getenv("SQLITE_DB_PATH", "data/careercopilot.db")
        os.makedirs(os.path.dirname(db_path), exist_ok=True)
        return f"sqlite:///{db_path}"

    def create_tables(self):
        """
        Creates all database tables defined in the SQLAlchemy models.

        This method uses the `Base.metadata` object, which collects all classes
        that inherit from the declarative base, and creates the corresponding
        tables in the database if they do not already exist.

        Raises:
            Exception: If table creation fails.
        """
        try:
            Base.metadata.create_all(bind=self.engine)
            logger.info(f"Database tables created successfully using {self.database_url}")
        except Exception as e:
            logger.error(f"Failed to create database tables: {e}")
            raise

    def drop_tables(self):
        """
        Drops all database tables. Use with extreme caution.

        This is a destructive operation that will remove all tables defined in
        `Base.metadata` and all their data from the database.

        Raises:
            Exception: If dropping tables fails.
        """
        try:
            Base.metadata.drop_all(bind=self.engine)
            logger.warning("All database tables dropped")
        except Exception as e:
            logger.error(f"Failed to drop database tables: {e}")
            raise


db_config = DatabaseConfig()


def get_db() -> Generator[Session, None, None]:
    """
    FastAPI dependency to get a database session.

    This generator function is used as a dependency in FastAPI endpoints. It
    yields a new SQLAlchemy `Session` for each request and ensures that the
    session is closed after the request is finished, even if an error occurs.

    Yields:
        A SQLAlchemy Session object.
    """
    db = db_config.SessionLocal()
    try:
        yield db
    finally:
        db.close()


@contextmanager
def get_db_session() -> Generator[Session, None, None]:
    """
    Provides a database session within a context manager.

    This is useful for database operations outside of the FastAPI request-response
    cycle, such as in background tasks or scripts. It handles the session's
    lifecycle, including committing on success, rolling back on error, and
    closing the connection.

    Yields:
        A SQLAlchemy Session object.
    """
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
    """
    Initializes the database by creating all necessary tables.

    This function should be called once on application startup to ensure that
    the database schema is up-to-date with the models.

    Raises:
        Exception: If the database initialization fails.
    """
    try:
        db_config.create_tables()
        logger.info("Database initialized successfully")
    except Exception as e:
        logger.error(f"Database initialization failed: {e}")
        raise


def check_database_health() -> dict:
    """
    Checks the health of the database connection.

    It attempts to execute a simple query to verify that the connection is
    alive and the database is responsive.

    Returns:
        A dictionary containing the health status ('healthy' or 'unhealthy'),
        the database type, and an error message if the check fails.
    """
    try:
        with get_db_session() as db:
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
