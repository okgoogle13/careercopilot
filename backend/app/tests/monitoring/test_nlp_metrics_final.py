"""Final coverage tests for nlp_metrics utility wrappers."""

from app.monitoring import nlp_metrics as module


def test_start_metrics_server_delegates(monkeypatch):
    calls = {}

    def _start(port):
        calls["port"] = port

    monkeypatch.setattr(module, "start_http_server", _start)

    module.start_metrics_server(9911)

    assert calls["port"] == 9911


def test_track_nlp_duration_returns_timer_object(monkeypatch):
    class _Timer:
        pass

    timer = _Timer()

    class _DurationMetric:
        def labels(self, endpoint, model):
            assert endpoint == "ingest"
            assert model == "flash"
            return self

        def time(self):
            return timer

    monkeypatch.setattr(module, "NLP_REQUEST_DURATION", _DurationMetric())

    assert module.track_nlp_duration("ingest", "flash") is timer
