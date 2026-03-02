#!/bin/bash
# Fix Stone component usages by removing mode prop

FILES=(
  "src/features/analysis/components/AnalysisDashboard.tsx"
  "src/features/applications/components/ApplicationDashboard.tsx"
  "src/features/onboarding/components/ValidationDashboard.tsx"
  "src/features/opportunities/Opportunities.tsx"
  "src/features/profile/components/ProfileView.tsx"
  "src/pages/AnalysisPage.tsx"
  "src/pages/IngestionPage.tsx"
)

cd /Users/okgoogle13/Projects/careercopilot/frontend

for file in "${FILES[@]}"; do
  if [ -f "$file" ]; then
    echo "Fixing $file..."
    # Remove mode="KrDark" or mode={mode} or mode={'KrDark'} props from Stone components
    sed -i '' 's/ mode="KrDark"//g' "$file"
    sed -i '' 's/ mode={mode}//g' "$file"
    sed -i '' "s/ mode={'KrDark'}//g" "$file"
    sed -i '' 's/ mode={"KrDark"}//g' "$file"
  fi
done

echo "Done!"
