from datetime import datetime, timezone

import pytest

from app.models.database import (
    AgentSession,
    AIInteraction,
    Application,
    Cache,
    Job,
    MarketAnalysis,
    User,
)


class TestDatabaseModels:
    def test_user_model(self):
        user = User(id="u1", email="test@test.com", name="Test")
        assert user.email == "test@test.com"
        assert user.name == "Test"
        assert user.is_active is True
        assert user.is_authenticated is True
        assert user.get_id() == "u1"
        assert repr(user) == "<User test@test.com>"

    def test_job_model(self):
        job = Job(id="j1", user_id="u1", title="Engineer", company="Tech")
        assert job.title == "Engineer"
        assert job.company == "Tech"
        assert repr(job) == "<Job Engineer at Tech>"

    def test_application_model(self):
        app = Application(id="a1", user_id="u1", job_id="j1")
        assert app.user_id == "u1"
        assert app.job_id == "j1"
        assert repr(app) == "<Application a1 for job j1>"

    def test_ai_interaction_model(self):
        interaction = AIInteraction(id="ai1", operation_type="gen", prompt="p", response="r")
        assert interaction.operation_type == "gen"
        assert repr(interaction) == "<AIInteraction ai1 (gen)>"

    def test_agent_session_model(self):
        session = AgentSession(id="s1", user_id="u1", session_type="search", status="active")
        assert session.session_type == "search"
        assert session.status == "active"
        assert session.is_active() is True
        assert repr(session) == "<AgentSession s1 (search - active)>"

        session.mark_completed({"res": "ok"})
        assert session.status == "completed"
        assert session.final_result == {"res": "ok"}
        assert session.is_active() is False

        session.mark_failed("error", {"detail": "x"})
        assert session.status == "failed"
        assert session.error_message == "error"

    def test_market_analysis_model(self):
        analysis = MarketAnalysis(field="tech", location="NY")
        assert analysis.field == "tech"
        assert analysis.location == "NY"
        assert repr(analysis) == "<MarketAnalysis tech in NY>"

    def test_base_to_dict_from_dict(self):
        # We need a mapped table for to_dict/from_dict, so use MarketAnalysis
        now = datetime.now(timezone.utc)
        # Note: timezone-aware datetime might cause issues with to_dict if not handled by SQLAlchemy exactly
        # so we test with simple fields
        analysis = MarketAnalysis(field="tech", location="NY", total_jobs_found=10)
        # to_dict won't work perfectly on unmapped/uncommitted instances sometimes depending on defaults,
        # but we can test the basic functionality

        # Fake the __table__.columns
        class ColumnMock:
            def __init__(self, name):
                self.name = name

        analysis.__table__ = type(
            "obj", (object,), {"columns": [ColumnMock("field"), ColumnMock("location")]}
        )

        d = analysis.to_dict()
        assert d["field"] == "tech"
        assert d["location"] == "NY"

        # from_dict
        analysis2 = MarketAnalysis.from_dict({"field": "finance", "location": "London"})
        assert analysis2.field == "finance"
        assert analysis2.location == "London"
