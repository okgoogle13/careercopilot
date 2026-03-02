#!/bin/bash
ASSET_LIST="/tmp/asset_list.txt"
STRINGS="/tmp/code_strings.txt"
REPORT="docs/ASSET_CLEANUP_REPORT.md"

echo "# ASSET_CLEANUP_REPORT" > $REPORT
echo "" >> $REPORT
echo "| Path | ReferencedInCode | Type | Classification | Reason |" >> $REPORT
echo "| :--- | :--- | :--- | :--- | :--- |" >> $REPORT

while read -r asset_path; do
    filename=$(basename "$asset_path")
    # Quick check in strings file
    if grep -qF "$filename" "$STRINGS"; then
        ref_status="Yes"
        classification="active"
        reason="referenced in code string search"
    else
        ref_status="No"
        classification="candidate-delete"
        reason="no references found in frontend/src strings"
    fi
    
    # Determine type
    extension="${filename##*.}"
    type="other"
    if [[ "$extension" == "png" || "$extension" == "jpg" || "$extension" == "jpeg" || "$extension" == "svg" || "$extension" == "gif" ]]; then
        type="image"
    fi
    
    echo "| \`$asset_path\` | $ref_status | $type | $classification | $reason |" >> $REPORT
done < "$ASSET_LIST"
