#!/bin/bash
set -e

echo '=== NORTHCOTE ASSET CONSOLIDATION ==='
TIMESTAMP=$(date +%s)
BACKUP_DIR=".asset_backup_$TIMESTAMP"

# 1. Backup Phase
echo "Creating backup at $BACKUP_DIR..."
mkdir -p "$BACKUP_DIR"
cp -r assets "$BACKUP_DIR/assets_canonical" 2>/dev/null || echo 'No canonical assets to backup'
cp -r "frontend/public/assets" "$BACKUP_DIR/frontend_public" 2>/dev/null || echo 'No frontend assets to backup'
cp -r "Curio images phase 3" "$BACKUP_DIR/phase3_source" 2>/dev/null || echo 'No phase 3 assets to backup'

# 2. Structure Phase
echo 'Ensuring canonical directory structure...'
mkdir -p assets/{plates,fauna,textures,specimens,ui,uncategorized}

# 3. Consolidation Phase
mkdir -p $(dirname /Users/okgoogle13/Desktop/careercopilot/assets/uncategorized/file-SdhoQzyxwnFQf85ada3bZS.webp)
echo "Moving file-SdhoQzyxwnFQf85ada3bZS.webp..."
mv -n '/Users/okgoogle13/Desktop/careercopilot/Curio images phase 3/file-SdhoQzyxwnFQf85ada3bZS.webp' /Users/okgoogle13/Desktop/careercopilot/assets/uncategorized/file-SdhoQzyxwnFQf85ada3bZS.webp
mkdir -p $(dirname /Users/okgoogle13/Desktop/careercopilot/assets/uncategorized/file-PS48DhLhcp37vpnhyDdsMT.webp)
echo "Moving file-PS48DhLhcp37vpnhyDdsMT.webp..."
mv -n '/Users/okgoogle13/Desktop/careercopilot/Curio images phase 3/file-PS48DhLhcp37vpnhyDdsMT.webp' /Users/okgoogle13/Desktop/careercopilot/assets/uncategorized/file-PS48DhLhcp37vpnhyDdsMT.webp
mkdir -p $(dirname '/Users/okgoogle13/Desktop/careercopilot/assets/ui/file-MGJYRLfbzTv3Mi3SkA1ui4 copy.webp')
echo "Moving file-MGJYRLfbzTv3Mi3SkA1ui4 copy.webp..."
mv -n '/Users/okgoogle13/Desktop/careercopilot/Curio images phase 3/file-MGJYRLfbzTv3Mi3SkA1ui4 copy.webp' '/Users/okgoogle13/Desktop/careercopilot/assets/ui/file-MGJYRLfbzTv3Mi3SkA1ui4 copy.webp'
mkdir -p $(dirname /Users/okgoogle13/Desktop/careercopilot/assets/uncategorized/file-LZzmgnJu5jYqZj1ASj3D9Z.webp)
echo "Moving file-LZzmgnJu5jYqZj1ASj3D9Z.webp..."
mv -n '/Users/okgoogle13/Desktop/careercopilot/Curio images phase 3/file-LZzmgnJu5jYqZj1ASj3D9Z.webp' /Users/okgoogle13/Desktop/careercopilot/assets/uncategorized/file-LZzmgnJu5jYqZj1ASj3D9Z.webp
mkdir -p $(dirname /Users/okgoogle13/Desktop/careercopilot/assets/uncategorized/file-HJdvkwhL6rav4cFJrr29Wf.webp)
echo "Moving file-HJdvkwhL6rav4cFJrr29Wf.webp..."
mv -n '/Users/okgoogle13/Desktop/careercopilot/Curio images phase 3/file-HJdvkwhL6rav4cFJrr29Wf.webp' /Users/okgoogle13/Desktop/careercopilot/assets/uncategorized/file-HJdvkwhL6rav4cFJrr29Wf.webp
mkdir -p $(dirname '/Users/okgoogle13/Desktop/careercopilot/assets/uncategorized/Generated Image January 19, 2026 - 2_11PM.jpeg')
echo "Moving Generated Image January 19, 2026 - 2_11PM.jpeg..."
mv -n '/Users/okgoogle13/Desktop/careercopilot/Curio images phase 3/Generated Image January 19, 2026 - 2_11PM.jpeg' '/Users/okgoogle13/Desktop/careercopilot/assets/uncategorized/Generated Image January 19, 2026 - 2_11PM.jpeg'
mkdir -p $(dirname /Users/okgoogle13/Desktop/careercopilot/assets/uncategorized/file-X3AfJnTjFMfEeDFLAVQzNi.webp)
echo "Moving file-X3AfJnTjFMfEeDFLAVQzNi.webp..."
mv -n '/Users/okgoogle13/Desktop/careercopilot/Curio images phase 3/file-X3AfJnTjFMfEeDFLAVQzNi.webp' /Users/okgoogle13/Desktop/careercopilot/assets/uncategorized/file-X3AfJnTjFMfEeDFLAVQzNi.webp
mkdir -p $(dirname '/Users/okgoogle13/Desktop/careercopilot/assets/uncategorized/Generated Image January 30, 2026 - 7_51AM.jpeg')
echo "Moving Generated Image January 30, 2026 - 7_51AM.jpeg..."
mv -n '/Users/okgoogle13/Desktop/careercopilot/Curio images phase 3/Generated Image January 30, 2026 - 7_51AM.jpeg' '/Users/okgoogle13/Desktop/careercopilot/assets/uncategorized/Generated Image January 30, 2026 - 7_51AM.jpeg'
mkdir -p $(dirname '/Users/okgoogle13/Desktop/careercopilot/assets/uncategorized/Screenshot 2026-01-18 at 05.45.43.png')
echo "Moving Screenshot 2026-01-18 at 05.45.43.png..."
mv -n '/Users/okgoogle13/Desktop/careercopilot/Curio images phase 3/Screenshot 2026-01-18 at 05.45.43.png' '/Users/okgoogle13/Desktop/careercopilot/assets/uncategorized/Screenshot 2026-01-18 at 05.45.43.png'
mkdir -p $(dirname '/Users/okgoogle13/Desktop/careercopilot/assets/uncategorized/Generated Image January 30, 2026 - 9_38PM.jpeg')
echo "Moving Generated Image January 30, 2026 - 9_38PM.jpeg..."
mv -n '/Users/okgoogle13/Desktop/careercopilot/Curio images phase 3/Generated Image January 30, 2026 - 9_38PM.jpeg' '/Users/okgoogle13/Desktop/careercopilot/assets/uncategorized/Generated Image January 30, 2026 - 9_38PM.jpeg'
mkdir -p $(dirname '/Users/okgoogle13/Desktop/careercopilot/assets/uncategorized/Generated Image January 30, 2026 - 7_57AM.jpeg')
echo "Moving Generated Image January 30, 2026 - 7_57AM.jpeg..."
mv -n '/Users/okgoogle13/Desktop/careercopilot/Curio images phase 3/Generated Image January 30, 2026 - 7_57AM.jpeg' '/Users/okgoogle13/Desktop/careercopilot/assets/uncategorized/Generated Image January 30, 2026 - 7_57AM.jpeg'
mkdir -p $(dirname '/Users/okgoogle13/Desktop/careercopilot/assets/uncategorized/Screenshot 2026-01-18 at 05.38.51.png')
echo "Moving Screenshot 2026-01-18 at 05.38.51.png..."
mv -n '/Users/okgoogle13/Desktop/careercopilot/Curio images phase 3/Screenshot 2026-01-18 at 05.38.51.png' '/Users/okgoogle13/Desktop/careercopilot/assets/uncategorized/Screenshot 2026-01-18 at 05.38.51.png'
mkdir -p $(dirname '/Users/okgoogle13/Desktop/careercopilot/assets/uncategorized/Generated Image January 19, 2026 - 2_05PM-2.jpeg')
echo "Moving Generated Image January 19, 2026 - 2_05PM-2.jpeg..."
mv -n '/Users/okgoogle13/Desktop/careercopilot/Curio images phase 3/Generated Image January 19, 2026 - 2_05PM-2.jpeg' '/Users/okgoogle13/Desktop/careercopilot/assets/uncategorized/Generated Image January 19, 2026 - 2_05PM-2.jpeg'
mkdir -p $(dirname '/Users/okgoogle13/Desktop/careercopilot/assets/uncategorized/Generated Image January 19, 2026 - 2_05PM.jpeg')
echo "Moving Generated Image January 19, 2026 - 2_05PM.jpeg..."
mv -n '/Users/okgoogle13/Desktop/careercopilot/Curio images phase 3/Generated Image January 19, 2026 - 2_05PM.jpeg' '/Users/okgoogle13/Desktop/careercopilot/assets/uncategorized/Generated Image January 19, 2026 - 2_05PM.jpeg'
mkdir -p $(dirname '/Users/okgoogle13/Desktop/careercopilot/assets/uncategorized/Generated Image January 19, 2026 - 2_09PM.jpeg')
echo "Moving Generated Image January 19, 2026 - 2_09PM.jpeg..."
mv -n '/Users/okgoogle13/Desktop/careercopilot/Curio images phase 3/Generated Image January 19, 2026 - 2_09PM.jpeg' '/Users/okgoogle13/Desktop/careercopilot/assets/uncategorized/Generated Image January 19, 2026 - 2_09PM.jpeg'
mkdir -p $(dirname '/Users/okgoogle13/Desktop/careercopilot/assets/uncategorized/Generated Image January 30, 2026 - 10_11PM.jpeg')
echo "Moving Generated Image January 30, 2026 - 10_11PM.jpeg..."
mv -n '/Users/okgoogle13/Desktop/careercopilot/Curio images phase 3/Generated Image January 30, 2026 - 10_11PM.jpeg' '/Users/okgoogle13/Desktop/careercopilot/assets/uncategorized/Generated Image January 30, 2026 - 10_11PM.jpeg'
mkdir -p $(dirname '/Users/okgoogle13/Desktop/careercopilot/assets/uncategorized/Generated Image January 19, 2026 - 7_28PM.jpeg')
echo "Moving Generated Image January 19, 2026 - 7_28PM.jpeg..."
mv -n '/Users/okgoogle13/Desktop/careercopilot/Curio images phase 3/Generated Image January 19, 2026 - 7_28PM.jpeg' '/Users/okgoogle13/Desktop/careercopilot/assets/uncategorized/Generated Image January 19, 2026 - 7_28PM.jpeg'
mkdir -p $(dirname '/Users/okgoogle13/Desktop/careercopilot/assets/uncategorized/Generated Image January 30, 2026 - 12_42AM.jpeg')
echo "Moving Generated Image January 30, 2026 - 12_42AM.jpeg..."
mv -n '/Users/okgoogle13/Desktop/careercopilot/Curio images phase 3/Generated Image January 30, 2026 - 12_42AM.jpeg' '/Users/okgoogle13/Desktop/careercopilot/assets/uncategorized/Generated Image January 30, 2026 - 12_42AM.jpeg'
mkdir -p $(dirname /Users/okgoogle13/Desktop/careercopilot/assets/uncategorized/file-UvyNA3R153vA95oow4Tcx2.webp)
echo "Moving file-UvyNA3R153vA95oow4Tcx2.webp..."
mv -n '/Users/okgoogle13/Desktop/careercopilot/Curio images phase 3/file-UvyNA3R153vA95oow4Tcx2.webp' /Users/okgoogle13/Desktop/careercopilot/assets/uncategorized/file-UvyNA3R153vA95oow4Tcx2.webp
mkdir -p $(dirname '/Users/okgoogle13/Desktop/careercopilot/assets/uncategorized/Generated Image January 30, 2026 - 7_54AM (5).jpeg')
echo "Moving Generated Image January 30, 2026 - 7_54AM (5).jpeg..."
mv -n '/Users/okgoogle13/Desktop/careercopilot/Curio images phase 3/Generated Image January 30, 2026 - 7_54AM (5).jpeg' '/Users/okgoogle13/Desktop/careercopilot/assets/uncategorized/Generated Image January 30, 2026 - 7_54AM (5).jpeg'
mkdir -p $(dirname '/Users/okgoogle13/Desktop/careercopilot/assets/uncategorized/Gemini_Generated_Image_usd1rtusd1rtusd1 (1).png')
echo "Moving Gemini_Generated_Image_usd1rtusd1rtusd1 (1).png..."
mv -n '/Users/okgoogle13/Desktop/careercopilot/Curio images phase 3/Gemini_Generated_Image_usd1rtusd1rtusd1 (1).png' '/Users/okgoogle13/Desktop/careercopilot/assets/uncategorized/Gemini_Generated_Image_usd1rtusd1rtusd1 (1).png'
mkdir -p $(dirname '/Users/okgoogle13/Desktop/careercopilot/assets/uncategorized/Generated Image January 30, 2026 - 7_52AM.jpeg')
echo "Moving Generated Image January 30, 2026 - 7_52AM.jpeg..."
mv -n '/Users/okgoogle13/Desktop/careercopilot/Curio images phase 3/Generated Image January 30, 2026 - 7_52AM.jpeg' '/Users/okgoogle13/Desktop/careercopilot/assets/uncategorized/Generated Image January 30, 2026 - 7_52AM.jpeg'
mkdir -p $(dirname '/Users/okgoogle13/Desktop/careercopilot/assets/uncategorized/Generated Image January 30, 2026 - 7_54AM (7).jpeg')
echo "Moving Generated Image January 30, 2026 - 7_54AM (7).jpeg..."
mv -n '/Users/okgoogle13/Desktop/careercopilot/Curio images phase 3/Generated Image January 30, 2026 - 7_54AM (7).jpeg' '/Users/okgoogle13/Desktop/careercopilot/assets/uncategorized/Generated Image January 30, 2026 - 7_54AM (7).jpeg'
mkdir -p $(dirname '/Users/okgoogle13/Desktop/careercopilot/assets/uncategorized/Generated Image January 19, 2026 - 2_00PM.jpeg')
echo "Moving Generated Image January 19, 2026 - 2_00PM.jpeg..."
mv -n '/Users/okgoogle13/Desktop/careercopilot/Curio images phase 3/Generated Image January 19, 2026 - 2_00PM.jpeg' '/Users/okgoogle13/Desktop/careercopilot/assets/uncategorized/Generated Image January 19, 2026 - 2_00PM.jpeg'
mkdir -p $(dirname /Users/okgoogle13/Desktop/careercopilot/assets/uncategorized/file-HmdMnQ2xsahy4XdQskqk2y.webp)
echo "Moving file-HmdMnQ2xsahy4XdQskqk2y.webp..."
mv -n '/Users/okgoogle13/Desktop/careercopilot/Curio images phase 3/file-HmdMnQ2xsahy4XdQskqk2y.webp' /Users/okgoogle13/Desktop/careercopilot/assets/uncategorized/file-HmdMnQ2xsahy4XdQskqk2y.webp
mkdir -p $(dirname /Users/okgoogle13/Desktop/careercopilot/assets/uncategorized/file-EeA2MMcW6g4fiJaAdR1KoE.webp)
echo "Moving file-EeA2MMcW6g4fiJaAdR1KoE.webp..."
mv -n '/Users/okgoogle13/Desktop/careercopilot/Curio images phase 3/file-EeA2MMcW6g4fiJaAdR1KoE.webp' /Users/okgoogle13/Desktop/careercopilot/assets/uncategorized/file-EeA2MMcW6g4fiJaAdR1KoE.webp
mkdir -p $(dirname '/Users/okgoogle13/Desktop/careercopilot/assets/uncategorized/Generated Image January 30, 2026 - 7_54AM (1).jpeg')
echo "Moving Generated Image January 30, 2026 - 7_54AM (1).jpeg..."
mv -n '/Users/okgoogle13/Desktop/careercopilot/Curio images phase 3/Generated Image January 30, 2026 - 7_54AM (1).jpeg' '/Users/okgoogle13/Desktop/careercopilot/assets/uncategorized/Generated Image January 30, 2026 - 7_54AM (1).jpeg'
mkdir -p $(dirname '/Users/okgoogle13/Desktop/careercopilot/assets/uncategorized/Generated Image January 30, 2026 - 7_56AM (2).jpeg')
echo "Moving Generated Image January 30, 2026 - 7_56AM (2).jpeg..."
mv -n '/Users/okgoogle13/Desktop/careercopilot/Curio images phase 3/Generated Image January 30, 2026 - 7_56AM (2).jpeg' '/Users/okgoogle13/Desktop/careercopilot/assets/uncategorized/Generated Image January 30, 2026 - 7_56AM (2).jpeg'
mkdir -p $(dirname '/Users/okgoogle13/Desktop/careercopilot/assets/uncategorized/file-GvB3iC5GJHzdjkySrKE7qA copy.webp')
echo "Moving file-GvB3iC5GJHzdjkySrKE7qA copy.webp..."
mv -n '/Users/okgoogle13/Desktop/careercopilot/Curio images phase 3/file-GvB3iC5GJHzdjkySrKE7qA copy.webp' '/Users/okgoogle13/Desktop/careercopilot/assets/uncategorized/file-GvB3iC5GJHzdjkySrKE7qA copy.webp'
mkdir -p $(dirname /Users/okgoogle13/Desktop/careercopilot/assets/uncategorized/file-51CtCwsNynzbsxgg2KdhPx.webp)
echo "Moving file-51CtCwsNynzbsxgg2KdhPx.webp..."
mv -n '/Users/okgoogle13/Desktop/careercopilot/Curio images phase 3/file-51CtCwsNynzbsxgg2KdhPx.webp' /Users/okgoogle13/Desktop/careercopilot/assets/uncategorized/file-51CtCwsNynzbsxgg2KdhPx.webp
mkdir -p $(dirname '/Users/okgoogle13/Desktop/careercopilot/assets/plates/DALL·E 2026-01-24 22.36.45 - Victorian-era scientific illustration plate of bats (Chiroptera), hand-tinted lithography with extreme austerity. Subject_ comparative anatomical stud.webp')
echo "Moving DALL·E 2026-01-24 22.36.45 - Victorian-era scientific illustration plate of bats (Chiroptera), hand-tinted lithography with extreme austerity. Subject_ comparative anatomical stud.webp..."
mv -n '/Users/okgoogle13/Desktop/careercopilot/Curio images phase 3/DALL·E 2026-01-24 22.36.45 - Victorian-era scientific illustration plate of bats (Chiroptera), hand-tinted lithography with extreme austerity. Subject_ comparative anatomical stud.webp' '/Users/okgoogle13/Desktop/careercopilot/assets/plates/DALL·E 2026-01-24 22.36.45 - Victorian-era scientific illustration plate of bats (Chiroptera), hand-tinted lithography with extreme austerity. Subject_ comparative anatomical stud.webp'
mkdir -p $(dirname '/Users/okgoogle13/Desktop/careercopilot/assets/uncategorized/Generated Image January 30, 2026 - 7_54AM (6).jpeg')
echo "Moving Generated Image January 30, 2026 - 7_54AM (6).jpeg..."
mv -n '/Users/okgoogle13/Desktop/careercopilot/Curio images phase 3/Generated Image January 30, 2026 - 7_54AM (6).jpeg' '/Users/okgoogle13/Desktop/careercopilot/assets/uncategorized/Generated Image January 30, 2026 - 7_54AM (6).jpeg'
mkdir -p $(dirname '/Users/okgoogle13/Desktop/careercopilot/assets/uncategorized/Generated Image January 19, 2026 - 1_58PM.jpeg')
echo "Moving Generated Image January 19, 2026 - 1_58PM.jpeg..."
mv -n '/Users/okgoogle13/Desktop/careercopilot/Curio images phase 3/Generated Image January 19, 2026 - 1_58PM.jpeg' '/Users/okgoogle13/Desktop/careercopilot/assets/uncategorized/Generated Image January 19, 2026 - 1_58PM.jpeg'
mkdir -p $(dirname '/Users/okgoogle13/Desktop/careercopilot/assets/uncategorized/Generated Image January 30, 2026 - 2_48PM.jpeg')
echo "Moving Generated Image January 30, 2026 - 2_48PM.jpeg..."
mv -n '/Users/okgoogle13/Desktop/careercopilot/Curio images phase 3/Generated Image January 30, 2026 - 2_48PM.jpeg' '/Users/okgoogle13/Desktop/careercopilot/assets/uncategorized/Generated Image January 30, 2026 - 2_48PM.jpeg'
mkdir -p $(dirname '/Users/okgoogle13/Desktop/careercopilot/assets/uncategorized/Generated Image January 30, 2026 - 7_54AM.jpeg')
echo "Moving Generated Image January 30, 2026 - 7_54AM.jpeg..."
mv -n '/Users/okgoogle13/Desktop/careercopilot/Curio images phase 3/Generated Image January 30, 2026 - 7_54AM.jpeg' '/Users/okgoogle13/Desktop/careercopilot/assets/uncategorized/Generated Image January 30, 2026 - 7_54AM.jpeg'
mkdir -p $(dirname '/Users/okgoogle13/Desktop/careercopilot/assets/uncategorized/Generated Image January 19, 2026 - 2_30PM.jpeg')
echo "Moving Generated Image January 19, 2026 - 2_30PM.jpeg..."
mv -n '/Users/okgoogle13/Desktop/careercopilot/Curio images phase 3/Generated Image January 19, 2026 - 2_30PM.jpeg' '/Users/okgoogle13/Desktop/careercopilot/assets/uncategorized/Generated Image January 19, 2026 - 2_30PM.jpeg'
mkdir -p $(dirname '/Users/okgoogle13/Desktop/careercopilot/assets/fauna/DALL·E 2026-01-24 22.27.46 - Victorian-era scientific illustration of nocturnal bats, hand-tinted lithograph aesthetic, observed by lamplight in a colonial Australian field statio.webp')
echo "Moving DALL·E 2026-01-24 22.27.46 - Victorian-era scientific illustration of nocturnal bats, hand-tinted lithograph aesthetic, observed by lamplight in a colonial Australian field statio.webp..."
mv -n '/Users/okgoogle13/Desktop/careercopilot/Curio images phase 3/DALL·E 2026-01-24 22.27.46 - Victorian-era scientific illustration of nocturnal bats, hand-tinted lithograph aesthetic, observed by lamplight in a colonial Australian field statio.webp' '/Users/okgoogle13/Desktop/careercopilot/assets/fauna/DALL·E 2026-01-24 22.27.46 - Victorian-era scientific illustration of nocturnal bats, hand-tinted lithograph aesthetic, observed by lamplight in a colonial Australian field statio.webp'
mkdir -p $(dirname '/Users/okgoogle13/Desktop/careercopilot/assets/uncategorized/Generated Image January 30, 2026 - 7_56AM (1).jpeg')
echo "Moving Generated Image January 30, 2026 - 7_56AM (1).jpeg..."
mv -n '/Users/okgoogle13/Desktop/careercopilot/Curio images phase 3/Generated Image January 30, 2026 - 7_56AM (1).jpeg' '/Users/okgoogle13/Desktop/careercopilot/assets/uncategorized/Generated Image January 30, 2026 - 7_56AM (1).jpeg'
mkdir -p $(dirname '/Users/okgoogle13/Desktop/careercopilot/assets/uncategorized/Screenshot 2026-01-18 at 05.47.29.png')
echo "Moving Screenshot 2026-01-18 at 05.47.29.png..."
mv -n '/Users/okgoogle13/Desktop/careercopilot/Curio images phase 3/Screenshot 2026-01-18 at 05.47.29.png' '/Users/okgoogle13/Desktop/careercopilot/assets/uncategorized/Screenshot 2026-01-18 at 05.47.29.png'
mkdir -p $(dirname '/Users/okgoogle13/Desktop/careercopilot/assets/uncategorized/Screenshot 2026-01-18 at 05.47.15.png')
echo "Moving Screenshot 2026-01-18 at 05.47.15.png..."
mv -n '/Users/okgoogle13/Desktop/careercopilot/Curio images phase 3/Screenshot 2026-01-18 at 05.47.15.png' '/Users/okgoogle13/Desktop/careercopilot/assets/uncategorized/Screenshot 2026-01-18 at 05.47.15.png'
mkdir -p $(dirname '/Users/okgoogle13/Desktop/careercopilot/assets/uncategorized/Generated Image January 30, 2026 - 7_56AM.jpeg')
echo "Moving Generated Image January 30, 2026 - 7_56AM.jpeg..."
mv -n '/Users/okgoogle13/Desktop/careercopilot/Curio images phase 3/Generated Image January 30, 2026 - 7_56AM.jpeg' '/Users/okgoogle13/Desktop/careercopilot/assets/uncategorized/Generated Image January 30, 2026 - 7_56AM.jpeg'
mkdir -p $(dirname /Users/okgoogle13/Desktop/careercopilot/assets/uncategorized/native-waratah-hanging.png)
echo "Moving native-waratah-hanging.png..."
mv -n /Users/okgoogle13/Desktop/careercopilot/frontend/public/assets/specimens/native-waratah-hanging.png /Users/okgoogle13/Desktop/careercopilot/assets/uncategorized/native-waratah-hanging.png
mkdir -p $(dirname /Users/okgoogle13/Desktop/careercopilot/assets/uncategorized/motif-laboratory-arborist-notes.png)
echo "Moving motif-laboratory-arborist-notes.png..."
mv -n /Users/okgoogle13/Desktop/careercopilot/frontend/public/assets/specimens/motif-laboratory-arborist-notes.png /Users/okgoogle13/Desktop/careercopilot/assets/uncategorized/motif-laboratory-arborist-notes.png
mkdir -p $(dirname /Users/okgoogle13/Desktop/careercopilot/assets/plates/motif-reference-archival-plate.png)
echo "Moving motif-reference-archival-plate.png..."
mv -n /Users/okgoogle13/Desktop/careercopilot/frontend/public/assets/specimens/motif-reference-archival-plate.png /Users/okgoogle13/Desktop/careercopilot/assets/plates/motif-reference-archival-plate.png
mkdir -p $(dirname /Users/okgoogle13/Desktop/careercopilot/assets/specimens/motif-gallery-core-specimen-series.png)
echo "Moving motif-gallery-core-specimen-series.png..."
mv -n /Users/okgoogle13/Desktop/careercopilot/frontend/public/assets/specimens/motif-gallery-core-specimen-series.png /Users/okgoogle13/Desktop/careercopilot/assets/specimens/motif-gallery-core-specimen-series.png
mkdir -p $(dirname /Users/okgoogle13/Desktop/careercopilot/assets/fauna/northcote-sentry-kookaburra.png)
echo "Moving northcote-sentry-kookaburra.png..."
mv -n /Users/okgoogle13/Desktop/careercopilot/frontend/public/assets/specimens/motif-gallery-sentry-kookaburra-1024.png /Users/okgoogle13/Desktop/careercopilot/assets/fauna/northcote-sentry-kookaburra.png
mkdir -p $(dirname /Users/okgoogle13/Desktop/careercopilot/assets/uncategorized/leaf-fern.png)
echo "Moving leaf-fern.png..."
mv -n /Users/okgoogle13/Desktop/careercopilot/frontend/public/assets/specimens/leaf-fern.png /Users/okgoogle13/Desktop/careercopilot/assets/uncategorized/leaf-fern.png
mkdir -p $(dirname /Users/okgoogle13/Desktop/careercopilot/assets/ui/motif-reference-field-guide.png)
echo "Moving motif-reference-field-guide.png..."
mv -n /Users/okgoogle13/Desktop/careercopilot/frontend/public/assets/specimens/motif-reference-field-guide.png /Users/okgoogle13/Desktop/careercopilot/assets/ui/motif-reference-field-guide.png
mkdir -p $(dirname /Users/okgoogle13/Desktop/careercopilot/assets/specimens/northcote-eucalyptus-echidna.png)
echo "Moving northcote-eucalyptus-echidna.png..."
mv -n /Users/okgoogle13/Desktop/careercopilot/frontend/public/assets/specimens/motif-gallery-eucalyptus-specimen.png /Users/okgoogle13/Desktop/careercopilot/assets/specimens/northcote-eucalyptus-echidna.png
mkdir -p $(dirname /Users/okgoogle13/Desktop/careercopilot/assets/uncategorized/motif-laboratory-anatomical-grid.png)
echo "Moving motif-laboratory-anatomical-grid.png..."
mv -n /Users/okgoogle13/Desktop/careercopilot/frontend/public/assets/specimens/motif-laboratory-anatomical-grid.png /Users/okgoogle13/Desktop/careercopilot/assets/uncategorized/motif-laboratory-anatomical-grid.png
mkdir -p $(dirname /Users/okgoogle13/Desktop/careercopilot/assets/uncategorized/motif-gallery-dryandra-hero.png)
echo "Moving motif-gallery-dryandra-hero.png..."
mv -n /Users/okgoogle13/Desktop/careercopilot/frontend/public/assets/specimens/motif-gallery-dryandra-hero.png /Users/okgoogle13/Desktop/careercopilot/assets/uncategorized/motif-gallery-dryandra-hero.png
mkdir -p $(dirname /Users/okgoogle13/Desktop/careercopilot/assets/textures/northcote-canopy-pattern.png)
echo "Moving northcote-canopy-pattern.png..."
mv -n /Users/okgoogle13/Desktop/careercopilot/frontend/public/assets/textures/texture-gallery-nocturnal-tile.png /Users/okgoogle13/Desktop/careercopilot/assets/textures/northcote-canopy-pattern.png
mkdir -p $(dirname /Users/okgoogle13/Desktop/careercopilot/assets/textures/texture-laboratory-parchment-source-1.png)
echo "Moving texture-laboratory-parchment-source-1.png..."
mv -n /Users/okgoogle13/Desktop/careercopilot/frontend/public/assets/textures/texture-laboratory-parchment-source-1.png /Users/okgoogle13/Desktop/careercopilot/assets/textures/texture-laboratory-parchment-source-1.png
mkdir -p $(dirname /Users/okgoogle13/Desktop/careercopilot/assets/textures/texture-laboratory-parchment-source-2.png)
echo "Moving texture-laboratory-parchment-source-2.png..."
mv -n /Users/okgoogle13/Desktop/careercopilot/frontend/public/assets/textures/texture-laboratory-parchment-source-2.png /Users/okgoogle13/Desktop/careercopilot/assets/textures/texture-laboratory-parchment-source-2.png
mkdir -p $(dirname /Users/okgoogle13/Desktop/careercopilot/assets/textures/texture-gallery-midnight-garden.jpg)
echo "Moving texture-gallery-midnight-garden.jpg..."
mv -n /Users/okgoogle13/Desktop/careercopilot/frontend/public/assets/textures/texture-gallery-midnight-garden.jpg /Users/okgoogle13/Desktop/careercopilot/assets/textures/texture-gallery-midnight-garden.jpg
mkdir -p $(dirname /Users/okgoogle13/Desktop/careercopilot/assets/textures/texture-laboratory-parchment-source-3.png)
echo "Moving texture-laboratory-parchment-source-3.png..."
mv -n /Users/okgoogle13/Desktop/careercopilot/frontend/public/assets/textures/texture-laboratory-parchment-source-3.png /Users/okgoogle13/Desktop/careercopilot/assets/textures/texture-laboratory-parchment-source-3.png
mkdir -p $(dirname /Users/okgoogle13/Desktop/careercopilot/assets/textures/texture-laboratory-parchment-source-4.png)
echo "Moving texture-laboratory-parchment-source-4.png..."
mv -n /Users/okgoogle13/Desktop/careercopilot/frontend/public/assets/textures/texture-laboratory-parchment-source-4.png /Users/okgoogle13/Desktop/careercopilot/assets/textures/texture-laboratory-parchment-source-4.png
mkdir -p $(dirname /Users/okgoogle13/Desktop/careercopilot/assets/textures/noise-grain.png)
echo "Moving noise-grain.png..."
mv -n /Users/okgoogle13/Desktop/careercopilot/frontend/public/assets/textures/noise-grain.png /Users/okgoogle13/Desktop/careercopilot/assets/textures/noise-grain.png
mkdir -p $(dirname /Users/okgoogle13/Desktop/careercopilot/assets/textures/texture-gallery-specimen-night-variant.jpg)
echo "Moving texture-gallery-specimen-night-variant.jpg..."
mv -n /Users/okgoogle13/Desktop/careercopilot/frontend/public/assets/textures/texture-gallery-specimen-night-variant.jpg /Users/okgoogle13/Desktop/careercopilot/assets/textures/texture-gallery-specimen-night-variant.jpg
mkdir -p $(dirname /Users/okgoogle13/Desktop/careercopilot/assets/uncategorized/gallery-nocturnal.webp)
echo "Moving gallery-nocturnal.webp..."
mv -n /Users/okgoogle13/Desktop/careercopilot/frontend/public/assets/wallpapers/gallery-nocturnal.webp /Users/okgoogle13/Desktop/careercopilot/assets/uncategorized/gallery-nocturnal.webp
mkdir -p $(dirname /Users/okgoogle13/Desktop/careercopilot/assets/uncategorized/lab-technical.webp)
echo "Moving lab-technical.webp..."
mv -n /Users/okgoogle13/Desktop/careercopilot/frontend/public/assets/wallpapers/lab-technical.webp /Users/okgoogle13/Desktop/careercopilot/assets/uncategorized/lab-technical.webp
mkdir -p $(dirname /Users/okgoogle13/Desktop/careercopilot/assets/uncategorized/northcote-curio-wallpaper-v2.png)
echo "Moving northcote-curio-wallpaper-v2.png..."
mv -n /Users/okgoogle13/Desktop/careercopilot/frontend/public/assets/wallpapers/gallery-nocturnal.png /Users/okgoogle13/Desktop/careercopilot/assets/uncategorized/northcote-curio-wallpaper-v2.png
mkdir -p $(dirname /Users/okgoogle13/Desktop/careercopilot/assets/plates/northcote-curio-wallpaper-v2.jpg)
echo "Moving northcote-curio-wallpaper-v2.jpg..."
mv -n /Users/okgoogle13/Desktop/careercopilot/frontend/public/assets/wallpapers/texture-gallery-curio-wallpaper-2048.jpg /Users/okgoogle13/Desktop/careercopilot/assets/plates/northcote-curio-wallpaper-v2.jpg

# 4. Symlink Phase
echo 'Replacing frontend assets with symlinks...'
rm -rf frontend/public/assets
ln -s ../../../assets frontend/public/assets

echo '=== CONSOLIDATION COMPLETE ==='
echo "Backup available at: $BACKUP_DIR"