from docx.shared import Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH

THEME_TOKENS = {
    "minimal": {
        "font": {
            "name": "Calibri",
            "size_pt": 11,
            "heading_color": RGBColor(0, 0, 0),
        },
        "alignment": {
            "heading": WD_ALIGN_PARAGRAPH.LEFT,
            "body": WD_ALIGN_PARAGRAPH.JUSTIFY,
            "contact": WD_ALIGN_PARAGRAPH.CENTER
        }
    },
    "modern": {
        "font": {
            "name": "Arial",
            "size_pt": 10,
            "heading_color": RGBColor(50, 50, 50),
        },
        "alignment": {
            "heading": WD_ALIGN_PARAGRAPH.LEFT,
            "body": WD_ALIGN_PARAGRAPH.LEFT,
            "contact": WD_ALIGN_PARAGRAPH.LEFT
        }
    }
}

def get_theme_tokens(theme_id: str) -> dict:
    """
    Retrieves visual design tokens for a specific theme, decoupling them from layout metrics.
    """
    return THEME_TOKENS.get(theme_id, THEME_TOKENS["minimal"])
