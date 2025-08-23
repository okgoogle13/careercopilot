# CareerCopilot Personal Edition

A personal AI-powered job search assistant designed for career changers transitioning from finance to social work/community services. Built with Google Genkit AI, FastAPI, and Firebase.

## 🎯 Features

- **Daily Job Discovery**: Automated scanning of Australian job boards for social work roles
- **Smart Company Research**: One-click company intelligence for better applications
- **Tailored Document Generation**: AI-powered resumes and cover letters for each application
- **ATS Optimization**: Ensure your documents pass applicant tracking systems
- **Application Tracking**: Monitor your applications and follow-up actions
- **Gmail Integration**: Automated email communications and status tracking

## 🚀 Quick Start

### 1. Installation
```bash
git clone https://github.com/yourusername/careercopilot.git
cd careercopilot
pip install -r requirements.txt
```

### 2. Configuration
```bash
# Copy environment template
cp .env.example .env

# Edit .env with your credentials
nano .env
```

### 3. Setup Personal System
```bash
# Run setup script to configure Firebase and personal profile
python scripts/setup_personal_system.py
```

### 4. Daily Usage
```bash
# Morning job discovery
python scripts/daily_job_scan.py

# Apply to specific job
python scripts/personal_automation.py apply "https://job-url.com"

# Start web interface
python src/backend/main.py
```

## 📁 Architecture

### Core Components
- **Personal Workflow**: Orchestrates all agents for single-user optimization
- **6 AI Agents**: Specialized agents for different career tasks
- **Firebase Backend**: State management and document storage
- **Simple Web Interface**: Clean UI for job management

### Agents
1. **Document Generator**: Creates tailored resumes/cover letters
2. **ATS Optimizer**: Optimizes documents for tracking systems
3. **Resume Parser**: Extracts data from existing resumes
4. **Job Matcher**: Finds relevant opportunities using RAG
5. **Application Tracker**: Monitors application status
6. **Email Integration**: Manages Gmail communications

## 🛠️ Personal Optimizations

This system is optimized for single-user personal use:
- **Cached Profile**: Your profile is loaded once and reused
- **Smart Batching**: Similar jobs are processed together
- **Local Preferences**: All settings tailored to your career transition
- **Australian Job Market**: Focused on AU social work opportunities
- **Finance-to-Social Work**: Specialized for your career change story

## 📊 Usage Examples

### Daily Morning Routine
```bash
python scripts/daily_job_scan.py
```
- Scans job boards for new social work positions
- Filters for relevant opportunities
- Generates AI summary of today's opportunities
- Emails you the daily brief

### Quick Job Application
```bash
python scripts/personal_automation.py apply "https://seek.com.au/job/123"
```
- Researches the company
- Generates tailored resume and cover letter
- Optimizes documents for ATS
- Tracks application in your personal database

### Weekly Review
```bash
python scripts/personal_automation.py review
```
- Checks Gmail for application responses
- Updates application statuses
- Generates weekly progress summary
- Suggests follow-up actions

## 🔧 Configuration

### Personal Profile Setup
Edit `data/user_profiles/personal_profile.json`:
```json
{
  "personal_info": {
    "name": "Your Name",
    "email": "nishantdougall@gmail.com",
    "location": "Northcote, VIC"
  },
  "career_transition": {
    "from": "Finance",
    "to": "Social Work/Community Services",
    "motivation": "Direct community impact"
  },
  "target_roles": [
    "Social Worker", "Case Manager", "Community Services Worker"
  ]
}
```

### Job Search Preferences
Configure in `config/personal_config.py`:
- Target locations (Melbourne, Victoria, Remote)
- Salary expectations
- Preferred work environments
- Automation settings

## 🧪 Testing

```bash
# Run all tests
pytest tests/

# Test specific agent
pytest tests/test_agents/test_document_generator.py

# Test personal workflow
pytest tests/test_personal_workflow.py
```

## 📝 Development

### Adding New Features
1. Create new agent in `src/backend/agents/`
2. Add to personal workflow orchestration
3. Write tests in `tests/test_agents/`
4. Update automation scripts if needed

### Customizing for Your Needs
- Modify job search criteria in `config/personal_config.py`
- Update templates in `data/templates/`
- Customize AI prompts in agent files
- Adjust automation schedules in scripts

## 🔒 Privacy & Data

All data stays in your personal Firebase project:
- No data sharing with third parties
- Local caching for performance
- Encrypted storage in Google Cloud
- You control all data retention

## 📞 Support

For personal use questions:
1. Check logs in `logs/` directory
2. Run test scripts in `scripts/test_agents/`
3. Review configuration in `config/`

## 🎯 Career Transition Focus

This system is specifically designed for finance-to-social work career changers:
- Emphasizes transferable skills from finance
- Targets Australian social work job market
- Optimizes for government and nonprofit applications
- Includes cultural competency considerations

---

**Built for personal productivity, powered by AI, focused on your success.**