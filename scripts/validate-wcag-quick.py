#!/usr/bin/env python3
"""Quick WCAG AA contrast check for key token combinations.

Target existing colors from frontend/src/design/tokens/tokens.json to ensure accessibility
before building real screens with Fraunces expressive axes.

Usage:
    python scripts/validate-wcag-quick.py
"""
import sys


def hex_to_rgb(hex_color):
    """Convert hex color to RGB tuple."""
    hex_color = hex_color.lstrip('#')
    return tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))


def luminance(rgb):
    """Calculate relative luminance per WCAG formula."""
    r, g, b = [c / 255.0 for c in rgb]
    r = r / 12.92 if r <= 0.03928 else ((r + 0.055) / 1.055) ** 2.4
    g = g / 12.92 if g <= 0.03928 else ((g + 0.055) / 1.055) ** 2.4
    b = b / 12.92 if b <= 0.03928 else ((b + 0.055) / 1.055) ** 2.4
    return 0.2126 * r + 0.7152 * g + 0.0722 * b


def contrast_ratio(fg, bg):
    """Calculate contrast ratio between two hex colors."""
    lum_fg = luminance(hex_to_rgb(fg))
    lum_bg = luminance(hex_to_rgb(bg))
    lighter = max(lum_fg, lum_bg)
    darker = min(lum_fg, lum_bg)
    return (lighter + 0.05) / (darker + 0.05)


# Key combinations from /design-system/tokens.json (lines 6-14)
# Format: (foreground_name, background_name, min_ratio_for_wcag)
TESTS = [
    ("paperWhite", "asphaltBlack", "4.5"),    # Text on background
    ("kr-ink-gold", "asphaltBlack", "3.0"),   # UI component on background
    ("waratahRed", "asphaltBlack", "3.0"),    # Error/alert on background
    ("gumLeafGreen", "asphaltBlack", "3.0"),  # Success/accent on background
]

# Token values from /design-system/tokens.json (top-level colors)
TOKENS = {
    "asphaltBlack": "#1A1714",
    "paperWhite": "#F5F0E8",
    "kr-ink-gold": "#D4A84B",
    "waratahRed": "#C45C4B",
    "gumLeafGreen": "#6B7F6E",
}


def main():
    """Run WCAG contrast validation."""
    print("🔍 Quick WCAG AA Contrast Check")
    print("=" * 55)

    failures = []
    for fg_name, bg_name, min_ratio_str in TESTS:
        fg = TOKENS.get(fg_name)
        bg = TOKENS.get(bg_name)

        if not fg or not bg:
            print(f"⚠️  SKIP  {fg_name:15} on {bg_name:15}: token not found")
            continue

        ratio = contrast_ratio(fg, bg)
        min_ratio = float(min_ratio_str)

        status = "✅" if ratio >= min_ratio else "❌"
        print(f"{status} {fg_name:15} on {bg_name:15}: {ratio:.2f}:1 (need {min_ratio_str}:1)")

        if ratio < min_ratio:
            failures.append((fg_name, bg_name, ratio, min_ratio))

    print("=" * 55)

    if failures:
        print(f"❌ {len(failures)} WCAG AA failures detected")
        for fg_name, bg_name, ratio, min_ratio in failures:
            print(f"   - {fg_name} ({ratio:.2f}:1) needs {min_ratio}:1 minimum on {bg_name}")
        return 1
    else:
        print("✅ All key combinations pass WCAG AA accessibility")
        return 0


if __name__ == "__main__":
    sys.exit(main())
