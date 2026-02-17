import os
import re
import datetime

# --- Configuration ---
ROOT_DIR = '/Users/okgoogle13/Desktop/careercopilot'
FRONTEND_DIR = os.path.join(ROOT_DIR, 'frontend', 'src')
DOCS_DIR = os.path.join(ROOT_DIR, 'docs', 'design-system')
MIGRATION_REPORT_PATH = os.path.join(DOCS_DIR, 'MIGRATION.md')

# --- Token Mappings ---
# Maps old token strings (regex compatible) to new token strings.
# Order matters: more specific matches should come first.

COLOR_MIGRATIONS = {
    # Red / Rational -> [DEPRECATED_STYLE] (Primary Rage)
    r'--color-[DEPRECATED_STYLE]-red-base': '--color-[DEPRECATED_STYLE]-primary',
    r'--color-[DEPRECATED_STYLE]-red': '--color-[DEPRECATED_STYLE]-primary',
    r'--sys-color-primary': '--color-[DEPRECATED_STYLE]-primary',
    r'--sys-color-error': '--color-[DEPRECATED_STYLE]-red-primary', # Urgent/Error -> [DEPRECATED_STYLE] Red

    # Gold / Optimism -> Baru Gold (Optimistic Resistance)
    r'--color-wattle-gold-base': '--color-baru-gold-primary',
    r'--color-wattle-gold': '--color-baru-gold-primary',
    r'--sys-color-secondary': '--color-baru-gold-primary',
    r'--sys-color-tertiary': '--color-eucalyptus-smoke-primary', # Tertiary often distinct, mapping to Green

    # Green / Nature -> Eucalyptus Smoke / Parrot (Melbourne)
    r'--northcote-green': '--color-eucalyptus-smoke-primary',

    # Backgrounds / Surface -> Charcoal (Dark UI Mandatory)
    r'--sys-color-surface': '--color-charcoal-primary',
    r'--sys-color-background': '--color-charcoal-primary',
    r'--color-asphalt-black': '--color-charcoal-primary',
    r'#1A1714': '#1a1a1a', # Ensure exact charcoal match
    r'#ffffff': '#1a1a1a', # KILL WHITE BACKGROUNDS
    r'#FFFFFF': '#1a1a1a',

    # Text / Content
    r'--sys-color-onSurface': '--color-eucalyptus-ash-primary',
    r'--sys-color-onBackground': '--color-eucalyptus-ash-primary',
    r'--color-paper-white': '--color-eucalyptus-ash-primary',
}

# New Variable Definitions to inject into CSS
NEW_CSS_VARIABLES = """
  /* KERALA RAGE COLOR SYSTEM */

  /* [DEPRECATED_STYLE] Red (Resistance/Rage) */
  --color-[DEPRECATED_STYLE]-shadow: #A02F0F;
  --color-[DEPRECATED_STYLE]-dark: #C03811;
  --color-[DEPRECATED_STYLE]-primary: #F14714;
  --color-[DEPRECATED_STYLE]-light: #FF6B3D;
  --color-[DEPRECATED_STYLE]-highlight: #FF9470;

  /* [DEPRECATED_STYLE] Night Red (Urgency/Warning) */
  --color-[DEPRECATED_STYLE]-red-dark: #D72F41;
  --color-[DEPRECATED_STYLE]-red-primary: #F14844;
  --color-[DEPRECATED_STYLE]-red-light: #FF6B66;

  /* Eucalyptus Smoke Green (Melancholy/Landscape) */
  --color-eucalyptus-smoke-dark: #42C47D;
  --color-eucalyptus-smoke-primary: #48DA8B;
  --color-eucalyptus-smoke-light: #6BE5A8;

  /* Parrot Green (Melbourne/Hybrid) */
  --color-parrot-primary: #48F0E5;

  /* Baru Gold (Optimism/Temple) */
  --color-baru-gold-dark: #D1EC68;
  --color-baru-gold-primary: #DAF674;
  --color-baru-gold-light: #E6FF90;

  /* Gum Leaf Yellow (Solidarity/Economics) */
  --color-gum-leaf-primary: #F6E748;

  /* Eucalyptus Ash (Skin/Structure/Text) */
  --color-eucalyptus-ash-dark: #C8E8A7;
  --color-eucalyptus-ash-primary: #DAF6B3;
  --color-eucalyptus-ash-light: #E8FBCC;

  /* Charcoal (Mandatory Dark Base) */
  --color-charcoal-shadow: #000000;
  --color-charcoal-dark: #0f0c0a;
  --color-charcoal-primary: #1a1a1a;
  --color-charcoal-surface: #2a2a2a;

  /* MAPPING TO SYSTEM UTILITIES */
  --sys-color-background: var(--color-charcoal-primary);
  --sys-color-surface: var(--color-charcoal-surface);
  --sys-color-primary: var(--color-[DEPRECATED_STYLE]-primary);
  --sys-color-secondary: var(--color-baru-gold-primary);
  --sys-color-tertiary: var(--color-eucalyptus-smoke-primary);
  --sys-color-error: var(--color-[DEPRECATED_STYLE]-red-primary);
  --sys-color-onBackground: var(--color-eucalyptus-ash-primary);
  --sys-color-onSurface: var(--color-eucalyptus-ash-primary);
  --sys-color-onPrimary: var(--color-charcoal-primary);
"""

class MigrationAutomator:
    def __init__(self):
        self.files_modified = []
        self.manual_check_needed = []

    def scan_and_migrate(self):
        print(f"Starting migration in {FRONTEND_DIR}...")

        for root, dirs, files in os.walk(FRONTEND_DIR):
            for file in files:
                if file.endswith(('.tsx', '.ts', '.css', '.module.css')):
                    self.process_file(os.path.join(root, file))

        self.update_css_definitions()
        self.generate_report()

    def process_file(self, filepath):
        try:
            with open(filepath, 'r') as f:
                content = f.read()

            original_content = content
            modified = False

            for old_pattern, new_token in COLOR_MIGRATIONS.items():
                # Simple string replacement for now, can use regex if patterns are complex
                # regex ensures we don't partial match if not careful, but tokens are usually distinct
                if re.search(re.escape(old_pattern), content, re.IGNORECASE):
                    content = re.sub(re.escape(old_pattern), new_token, content, flags=re.IGNORECASE)
                    modified = True

            # Special check for "white" background classes in Tailwind
            if 'bg-white' in content:
                content = content.replace('bg-white', 'bg-[#1a1a1a]')
                modified = True

            if modified:
                with open(filepath, 'w') as f:
                    f.write(content)
                self.files_modified.append(filepath)
                # print(f"Migrated: {filepath}")

        except Exception as e:
            print(f"Error processing {filepath}: {e}")

    def update_css_definitions(self):
        # Locate the main token file to inject new variables
        # Based on user context, it seems to be northcote.css or design-tokens.css
        target_css = os.path.join(FRONTEND_DIR, 'design', 'styles', 'northcote.css')

        if os.path.exists(target_css):
            print(f"Updating definitions in {target_css}...")
            with open(target_css, 'r') as f:
                content = f.read()

            # Inject into :root if it exists
            if ':root {' in content:
                # Naive injection at the start of root
                new_content = content.replace(':root {', f':root {{\n{NEW_CSS_VARIABLES}\n')
                with open(target_css, 'w') as f:
                    f.write(new_content)
                self.files_modified.append(target_css)
            else:
                print(f"WARNING: No :root found in {target_css}")
                self.manual_check_needed.append(f"Check {target_css} for manual variable injection.")
        else:
            print(f"WARNING: Could not find {target_css}")
            self.manual_check_needed.append("Could not find northcote.css to inject new variables.")

    def _generate_tokens_json(self):
        """Generates a tokens.json file reflecting the new Kerala Rage system."""
        tokens_path = os.path.join(FRONTEND_DIR, 'design', 'tokens', 'tokens.json')
        print(f"Generating {tokens_path}...")

        # We can either parse the existing one and update it, or write a new structure.
        # Given the "Northcote [DEPRECATED_STYLE]" existing structure is complex, let's try to update key fields
        # if the file exists, otherwise write a fresh one.

        import json

        new_tokens = {
            "name": "Kerala Rage",
            "version": "3.0.0",
            "$description": "Authoritative Design Tokens for the Kerala Rage Design System.",
             "shadow": {
                "subtle": { "$value": "0 2px 4px rgba(0, 0, 0, 0.25)", "$type": "shadow" },
                "standard": { "$value": "0 4px 8px rgba(0, 0, 0, 0.35)", "$type": "shadow" },
                "hover": { "$value": "0 8px 16px rgba(0, 0, 0, 0.45)", "$type": "shadow" },
                "maximum": { "$value": "0 16px 32px rgba(0, 0, 0, 0.55)", "$type": "shadow" },
                "wattle-offset": { "$value": "2px 2px 0px #DAF674", "$type": "shadow" },
                "[DEPRECATED_STYLE]-bleed": { "$value": "0 0 12px #F14714", "$type": "shadow" }
            }
        }

        try:
            if os.path.exists(tokens_path):
                with open(tokens_path, 'r') as f:
                    existing = json.load(f)

                # Update specific sections
                existing['name'] = new_tokens['name']
                existing['version'] = new_tokens['version']
                existing['$description'] = new_tokens['$description']
                existing['shadow'] = new_tokens['shadow']

                # Update semantic colors if possible (naive update)
                if 'color' in existing and 'semantic' in existing['color']:
                     existing['color']['semantic']['wattle-gold']['$value'] = "#DAF674" # Baru Gold
                     existing['color']['semantic']['[DEPRECATED_STYLE]-red']['$value'] = "#F14714" # [DEPRECATED_STYLE]
                     existing['color']['semantic']['asphalt-black']['$value'] = "#1a1a1a" # Charcoal

                final_content = existing
            else:
                final_content = new_tokens

            with open(tokens_path, 'w') as f:
                json.dump(final_content, f, indent=2)
            self.files_modified.append(tokens_path)

        except Exception as e:
            print(f"Error generating tokens.json: {e}")
            self.manual_check_needed.append(f"Failed to generate tokens.json: {e}")

    def generate_report(self):
        report = f"""# Kerala Rage Migration Report
Date: {datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")}

## Summary
- **Files Modified:** {len(self.files_modified)}
- **Migration Strategy:** Regex substitution of legacy tokens to new semantic tokens + tokens.json generation.

## Files Modified
"""
        for f in self.files_modified:
            rel_path = os.path.relpath(f, ROOT_DIR)
            report += f"- `{rel_path}`\n"

        report += """
## Manual Cleanup Required

> [!IMPORTANT]
> The following items require human attention:

1. **Verify Dark Mode:** confirm that `bg-[#1a1a1a]` (Charcoal) is applied correctly and text contrast is sufficient.
2. **Typography Axes:** The script did NOT update font families or variable axes settings.
   - Global search for `font-family` and ensure `Inter Variable` or `Recursive` is used.
   - Update `tailwind.config.ts` if needed.
3. **Motion:** Check animations. Legacy linear easings may still exist.
4. **CSS Variables:** Verify `northcote.css` contains the new root variables.
5. **Shadows:** Check `tokens.json` for new shadow definitions.

"""
        if self.manual_check_needed:
            report += "## Script Warnings\n"
            for warning in self.manual_check_needed:
                report += f"- {warning}\n"

        os.makedirs(os.path.dirname(MIGRATION_REPORT_PATH), exist_ok=True)
        with open(MIGRATION_REPORT_PATH, 'w') as f:
            f.write(report)
        print(f"Report generated at: {MIGRATION_REPORT_PATH}")

if __name__ == "__main__":
    automator = MigrationAutomator()
    automator.scan_and_migrate()
    automator._generate_tokens_json() # Explicitly call the new method
