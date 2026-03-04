from app.models.database import AgentSession


class TestAgentSessionMethods:
    def test_mark_completed_with_result(self):
        session = AgentSession(user_id="u1", session_type="search")
        result = {"found": 10}
        session.mark_completed(result=result)
        assert session.status == "completed"
        assert session.final_result == result
        assert session.completed_at is not None

    def test_mark_completed_without_result(self):
        session = AgentSession(user_id="u1", session_type="search")
        session.mark_completed()
        assert session.status == "completed"
        # final_result is None until persisted if not explicitly set
        assert session.final_result is None
        assert session.completed_at is not None

    def test_mark_failed_with_details(self):
        session = AgentSession(user_id="u1", session_type="search")
        details = {"step": "extraction"}
        session.mark_failed(error="Timeout", details=details)
        assert session.status == "failed"
        assert session.error_message == "Timeout"
        assert session.error_details == details
        assert session.completed_at is not None

    def test_mark_failed_without_details(self):
        session = AgentSession(user_id="u1", session_type="search")
        session.mark_failed(error="Fatal")
        assert session.status == "failed"
        # error_details is None until persisted if not explicitly set
        assert session.error_details is None
        assert session.completed_at is not None
