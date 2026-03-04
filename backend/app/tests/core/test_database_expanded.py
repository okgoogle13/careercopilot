import os
from unittest.mock import ANY, MagicMock, patch

import pytest

from app.core import database
from app.core.database import (
    DatabaseConfig,
    check_database_health,
    get_db,
    get_db_session,
    init_database,
)


class TestDatabaseExpanded:
    def test_database_config_postgresql(self):
        env_vars = {
            "DATABASE_URL": "postgresql://user:pass@localhost/db",
            "DB_ECHO": "true",
            "DB_POOL_SIZE": "20",
            "DB_MAX_OVERFLOW": "30",
            "DB_POOL_TIMEOUT": "60",
            "DB_POOL_RECYCLE": "3600",
        }
        with patch.dict(os.environ, env_vars):
            with patch("app.core.database.create_engine") as mock_create:
                db_cfg = DatabaseConfig()
                assert db_cfg.is_postgresql is True
                assert db_cfg.is_sqlite is False

                # Verify pooling kwargs
                mock_create.assert_called_once()
                args, kwargs = mock_create.call_args
                assert args[0] == "postgresql://user:pass@localhost/db"
                assert kwargs["echo"] is True
                assert kwargs["pool_size"] == 20
                assert kwargs["max_overflow"] == 30
                assert kwargs["pool_timeout"] == 60
                assert kwargs["pool_recycle"] == 3600

    def test_database_config_sqlite_dirs(self):
        # Test directory creation for SQLite
        with patch.dict(os.environ, {"DATABASE_URL": "", "SQLITE_DB_PATH": "temp_db_dir/test.db"}):
            with patch("os.makedirs") as mock_makedirs:
                with patch("app.core.database.create_engine"):
                    with patch("sqlalchemy.event.listens_for") as mock_listens:
                        # The decorator returns the function it wraps
                        mock_decorator = MagicMock(side_effect=lambda f: f)
                        mock_listens.return_value = mock_decorator

                        DatabaseConfig()
                        mock_makedirs.assert_called_with("temp_db_dir", exist_ok=True)
                        mock_listens.assert_called_with(ANY, "connect")

                        # Verify the wrapped function (set_sqlite_pragma) works
                        pragma_func = mock_decorator.call_args[0][0]
                        mock_conn = MagicMock()
                        pragma_func(mock_conn, None)
                        assert mock_conn.cursor.return_value.execute.call_count == 4

    def test_database_config_sqlite_no_dirs(self):
        # Test SQLite with no directory in path
        with patch.dict(os.environ, {"DATABASE_URL": "", "SQLITE_DB_PATH": "test.db"}):
            with patch("os.makedirs") as mock_makedirs:
                with patch("app.core.database.create_engine"):
                    with patch("sqlalchemy.event.listens_for"):
                        DatabaseConfig()
                        mock_makedirs.assert_not_called()

    def test_database_config_generic_url(self):
        # Test generic database URL (hits 39->50 missing branch)
        with patch.dict(os.environ, {"DATABASE_URL": "mysql://user:pass@localhost/db"}):
            with patch("app.core.database.create_engine") as mock_create:
                db_cfg = DatabaseConfig()
                assert db_cfg.is_postgresql is False
                assert db_cfg.is_sqlite is False
                mock_create.assert_called_once()
                _, kwargs = mock_create.call_args
                # Should not have postgres-specific pooling args
                assert "pool_size" not in kwargs

    def test_create_tables_success(self):
        with patch("app.models.database.Base.metadata.create_all") as mock_create:
            with patch("app.core.database.logger.info") as mock_log:
                database.db_config.create_tables()
                mock_create.assert_called_once()
                mock_log.assert_called()

    def test_create_tables_failure(self):
        with patch("app.models.database.Base.metadata.create_all", side_effect=Exception("Failed")):
            with patch("app.core.database.logger.error") as mock_log:
                with pytest.raises(Exception):
                    database.db_config.create_tables()
                mock_log.assert_called()

    def test_drop_tables_success(self):
        with patch("app.models.database.Base.metadata.drop_all") as mock_drop:
            database.db_config.drop_tables()
            mock_drop.assert_called_once()

    def test_drop_tables_failure(self):
        with patch("app.models.database.Base.metadata.drop_all", side_effect=Exception("Error")):
            with patch("app.core.database.logger.error") as mock_log:
                with pytest.raises(Exception):
                    database.db_config.drop_tables()
                mock_log.assert_called()

    def test_init_database_failure(self):
        with patch.object(database.db_config, "create_tables", side_effect=Exception("Init Fail")):
            with patch("app.core.database.logger.error") as mock_log:
                with pytest.raises(Exception):
                    init_database()
                mock_log.assert_called()

    def test_get_db_yield(self):
        mock_session = MagicMock()
        with patch.object(database.db_config, "SessionLocal", return_value=mock_session):
            gen = get_db()
            db = next(gen)
            assert db == mock_session
            try:
                next(gen)
            except StopIteration:
                pass
            mock_session.close.assert_called_once()

    def test_get_db_session_success(self):
        mock_session = MagicMock()
        with patch.object(database.db_config, "SessionLocal", return_value=mock_session):
            with get_db_session() as db:
                assert db == mock_session
            mock_session.commit.assert_called_once()
            mock_session.close.assert_called_once()

    def test_get_db_session_failure(self):
        mock_session = MagicMock()
        with patch.object(database.db_config, "SessionLocal", return_value=mock_session):
            with pytest.raises(RuntimeError):
                with get_db_session() as db:
                    raise RuntimeError("BOOM")
            mock_session.rollback.assert_called_once()
            mock_session.close.assert_called_once()

    def test_init_database(self):
        with patch.object(database.db_config, "create_tables") as mock_create:
            init_database()
            mock_create.assert_called_once()

    def test_check_database_health_healthy(self):
        mock_session = MagicMock()
        with patch("app.core.database.get_db_session") as mock_get_session:
            mock_get_session.return_value.__enter__.return_value = mock_session
            health = check_database_health()
            assert health["status"] == "healthy"
            mock_session.execute.assert_called()

    def test_check_database_health_unhealthy(self):
        with patch("app.core.database.get_db_session", side_effect=Exception("Conn error")):
            health = check_database_health()
            assert health["status"] == "unhealthy"
            assert "Conn error" in health["error"]
