#!/usr/bin/env bash
set -euo pipefail
# FIREWALL: Targeted at Content/UI only. STRICTLY EXCLUDES TOKENS/CSS.
STYLE_PATTERN='[DEPRECATED_STYLE]|[DEPRECATED_STYLE]|[DEPRECATED_STYLE]|[DEPRECATED_STYLE]|[DEPRECATED_STYLE]|[DEPRECATED_STYLE]|[DEPRECATED_STYLE]|[DEPRECATED_STYLE]|[DEPRECATED_STYLE]|[DEPRECATED_STYLE]'
MODE_PATTERN='[DEPRECATED_MODE]|[DEPRECATED_MODE]'
COMBINED_PATTERN="${STYLE_PATTERN}|${MODE_PATTERN}"
EXCLUDES=( --glob '!.git/**' --glob '!node_modules/**' --glob '!tokens.json' --glob '!*.css' --glob '!*.lock' --glob '!dist/**' )
rg -l -i --hidden "${EXCLUDES[@]}" "$COMBINED_PATTERN" . | while read f; do
  [ -d "$f" ] && continue
  cp "$f" "$f.bak"
  perl -i -pe "s/\b(${MODE_PATTERN})\b/[DEPRECATED_MODE]/ig; s/\b(${STYLE_PATTERN})\b/[DEPRECATED_STYLE]/ig;" "$f"
done
