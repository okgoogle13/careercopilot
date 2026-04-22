import os
import re

components_dir = 'frontend/src/features/analysis/components'
feature_dir = os.path.join(components_dir, 'feature')

# Fix files in feature/ directory
for file in os.listdir(feature_dir):
    if not file.endswith('.tsx') and not file.endswith('.ts'):
        continue
    path = os.path.join(feature_dir, file)
    with open(path, 'r') as f:
        content = f.read()

    content = content.replace("'../../../types/career'", "'../../../../types/career'")
    content = content.replace("'../../../config/resume-constants'", "'../../../../config/resume-constants'")
    content = content.replace("'../hooks/useStudioMatch'", "'../../hooks/useStudioMatch'")

    with open(path, 'w') as f:
        f.write(content)

# Fix ATSScoreCard and SuggestionsPanel
for file in ['ATSScoreCard.tsx', 'SuggestionsPanel.tsx']:
    path = os.path.join(components_dir, file)
    if os.path.exists(path):
        with open(path, 'r') as f:
            content = f.read()
        content = content.replace("import { DocumentType } from '../../../types/career';", "")
        content = content.replace("import { CareerDatabase, JobOpportunity, DocumentType }", "import { CareerDatabase, JobOpportunity }")
        content = content.replace("DocumentType", "('resume' | 'coverLetter')")
        with open(path, 'w') as f:
            f.write(content)

# Fix CoverLetterSpecificMetrics
clsm_path = os.path.join(components_dir, 'CoverLetterSpecificMetrics.tsx')
if os.path.exists(clsm_path):
    with open(clsm_path, 'r') as f:
        content = f.read()
    content = content.replace("'../src/components/ui/MetricCard'", "'../../../components/ui/MetricCard'") # Wait, frontend/src/features/analysis/components/CoverLetterSpecificMetrics.tsx -> frontend/src/components/ui/MetricCard is ../../../components/ui/MetricCard
    with open(clsm_path, 'w') as f:
        f.write(content)

# Fix useStudioMatch imported path
sm_path = 'frontend/src/features/analysis/hooks/useStudioMatch.ts'
with open(sm_path, 'r') as f:
    content = f.read()
content = content.replace("'../../hooks/useAutoSave'", "'../../../hooks/useAutoSave'")
content = content.replace("type: 'text/markdown;charset=utf-8'", "type: 'text/markdown;charset=utf-8' as any")
with open(sm_path, 'w') as f:
    f.write(content)

print("Fixed imports")
