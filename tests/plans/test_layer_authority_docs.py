from pathlib import Path


def test_agents_declares_layer_authority():
    text = Path("AGENTS.md").read_text()
    assert "design truth" in text
    assert "runtime truth" in text
    assert "capability truth" in text
