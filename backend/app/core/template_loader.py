from __future__ import annotations

from pathlib import Path

from jinja2 import Environment, FileSystemLoader, Template

_TEMPLATES_DIR = Path(__file__).parent.parent / "templates"

_TEMPLATE_FILES = {
    "resume": "resume.jinja2",
    "cover_letter": "cover_letter.jinja2",
}


class TemplateLoader:
    def __init__(self, templates_dir: Path = _TEMPLATES_DIR) -> None:
        self._env = Environment(
            loader=FileSystemLoader(str(templates_dir)),
            autoescape=False,
        )

    def get(self, name: str) -> Template:
        filename = _TEMPLATE_FILES.get(name)
        if filename is None:
            valid_names = ", ".join(sorted(_TEMPLATE_FILES))
            raise ValueError(f"Unknown template: '{name}'. Valid names: {valid_names}")
        return self._env.get_template(filename)
