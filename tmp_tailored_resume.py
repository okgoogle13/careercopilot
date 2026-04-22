path = 'frontend/src/features/analysis/hooks/useTailoredResume.ts'
with open(path, 'r') as f:
    content = f.read()
content = content.replace("from '../types'", "from '../../../types/career'")
content = content.replace("from '../constants'", "from '../../../config/resume-constants'")
content = content.replace("from '../components/feature/", "from '../components/feature/")
with open(path, 'w') as f:
    f.write(content)
