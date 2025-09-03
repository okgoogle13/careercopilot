# Personal CareerCopilot Setup Guide

This guide will help you set up your personal AI-powered job search automation system in about 30 minutes.

## 📋 Prerequisites

Before you begin, ensure you have:

- **Python 3.9+** installed on your computer
- **Git** for version control
- A **Google Cloud account** (free tier is sufficient)
- A **Gmail account** for email integration
- **Gemini API access** (Google's AI model)

## 🚀 Quick Setup (5 Steps)

### Step 1: Clone and Install

```bash
# Clone the repository
git clone https://github.com/yourusername/careercopilot.git
cd careercopilot

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### Step 2: Run Setup Script

```bash
# Run the interactive setup
python scripts/setup_personal_system.py
```

This will:
- Create necessary directories and files
- Walk you through personal configuration
- Set up your profile and preferences
- Create document templates

### Step 3: Configure API Keys

Edit the `.env` file with your API credentials:

```bash
# Copy the example file
cp .env.example .env

# Edit with your credentials
nano .env  # or use your preferred editor
```

Required credentials:
```bash
# Google AI (Gemini)
GEMINI_API_KEY=your-gemini-api-key-here

# Firebase (optional but recommended)
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_CREDENTIALS_PATH=path/to/firebase-credentials.json

# Gmail Integration (optional)
GMAIL_CLIENT_ID=your-gmail-client-id
GMAIL_CLIENT_SECRET=your-gmail-client-secret
```

### Step 4: Test the System

```bash
# Test daily job scanning
python scripts/daily_job_scan.py

# Test the web interface
python src/backend/main.py
```

Visit `http://localhost:8000` to see your dashboard.

### Step 5: Set Up Automation (Optional)

```bash
# Set up daily automation
python scripts/daily_job_scan.py --setup-cron
```

## 🔑 Getting API Keys

### Google Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Click "Create API Key"
3. Copy the key to your `.env` file

### Firebase Setup (Optional)

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project
3. Go to Project Settings → Service Accounts
4. Generate new private key
5. Save the JSON file and update path in `.env`

### Gmail API Setup (Optional)

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Enable Gmail API
3. Create OAuth2 credentials
4. Add your email to test users
5. Update credentials in `.env`

## 📁 Directory Structure After Setup

```
careercopilot/
├── .env                          # Your API keys and configuration
├── data/
│   ├── user_profiles/
│   │   └── personal_profile.json # Your personal profile
│   └── templates/
│       ├── resume_template.txt   # Resume template
│       └── cover_letter_template.txt # Cover letter template
├── logs/
│   └── daily_job_scan.log       # System logs
└── src/backend/main.py          # Web interface
```

## 🔧 Personal Configuration

Your personal settings are stored in `data/user_profiles/personal_profile.json`:

```json
{
  "personal_info": {
    "name": "Your Name",
    "email": "your.email@gmail.com",
    "location": "Your Location"
  },
  "career_transition": {
    "from": "Finance",
    "to": "Social Work/Community Services"
  },
  "preferences": {
    "target_roles": [
      "Social Worker",
      "Case Manager",
      "Community Services Worker"
    ],
    "salary_range": {
      "min": 60000,
      "max": 85000,
      "currency": "AUD"
    }
  }
}
```

## 📱 Daily Usage

### Morning Routine (Automated)
```bash
# Run automatically at 9 AM or manually:
python scripts/daily_job_scan.py
```

This will:
- Scan Australian job boards for relevant positions
- Generate tailored application materials for promising roles
- Email you a daily summary with opportunities

### Apply to Specific Job
```bash
# Apply to a specific job
python scripts/personal_automation.py apply "https://seek.com.au/job/123456"
```

This will:
- Research the company
- Generate tailored resume and cover letter
- Optimize documents for ATS systems
- Track the application

### Weekly Review
```bash
# Run weekly review
python scripts/personal_automation.py review
```

This will:
- Check your Gmail for application responses
- Update application statuses
- Generate progress summary
- Suggest next steps

### Web Interface
```bash
# Start the web dashboard
python src/backend/main.py
```

Visit `http://localhost:8000` for:
- Job discovery dashboard
- Application tracking
- Company research tool
- Settings management

## 🛠️ Customization

### Job Sources
Edit `config/personal_config.py` to add/modify job sources:

```python
job_sources = {
    "seek": "https://www.seek.com.au/jobs-in-social-work/rss",
    "indeed": "https://au.indeed.com/rss?q=social+work+melbourne",
    "ethical_jobs": "https://www.ethicaljobs.com.au/rss/jobs?category=social-services",
    # Add your own sources
}
```

### Document Templates
Customize templates in `data/templates/`:
- `resume_template.txt` - Your resume format
- `cover_letter_template.txt` - Your cover letter format

### Personal Story
Update your career transition story in the configuration to personalize AI-generated content.

## 📊 Monitoring & Logs

### Log Files
- `logs/daily_job_scan.log` - Daily scanning activity
- `logs/application_activity.log` - Application tracking
- `logs/error.log` - Error reports

### Dashboard Metrics
- Jobs discovered today/this week
- Application response rates
- ATS optimization scores
- Skills development recommendations

## 🔒 Privacy & Data

### Data Storage
- **Local Storage**: Personal profiles, job data, generated documents
- **Firebase (Optional)**: Encrypted cloud backup and sync
- **No Third-Party Sharing**: All data remains private

### What Gets Stored
- Your personal profile and preferences
- Job opportunities and match scores
- Generated application materials
- Application tracking data
- Company research notes

## 🆘 Troubleshooting

### Common Issues

**"ModuleNotFoundError"**
```bash
# Ensure you're in the virtual environment
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows

# Reinstall dependencies
pip install -r requirements.txt
```

**"Firebase not initialized"**
- Check your Firebase credentials path
- Ensure the service account JSON file exists
- Verify your Firebase project ID

**"No jobs found"**
- Check your internet connection
- Verify job source URLs are working
- Review your job search criteria in config

**"Gemini API error"**
- Verify your API key is correct
- Check you haven't exceeded quotas
- Ensure Gemini API is enabled

### Getting Help

1. **Check Logs**: Review log files for error details
2. **Test Components**: Run individual scripts to isolate issues
3. **Verify Configuration**: Ensure all API keys are valid
4. **Check Network**: Ensure internet connectivity for job scanning

## 📈 Advanced Features

### Custom Job Matching
Modify the job matching algorithm in `src/backend/agents/job_matcher.py` to adjust:
- Match scoring criteria
- Skill gap analysis
- Location preferences
- Salary filtering

### Email Templates
Customize automated emails in the agents to match your style and tone.

### Integration with Other Services
Add connections to:
- LinkedIn for networking
- Calendar apps for interview scheduling
- Note-taking apps for research storage

## 🔄 Updates & Maintenance

### Regular Maintenance
- **Weekly**: Review and update job search criteria
- **Monthly**: Clean up old job data and logs
- **Quarterly**: Update personal profile and skills

### System Updates
```bash
# Update dependencies
pip install -r requirements.txt --upgrade

# Clear cache periodically
python -c "from src.backend.utils.cache import PersonalCache; cache = PersonalCache(); cache.clear()"
```

## 🎯 Success Tips

1. **Consistent Usage**: Run daily scans consistently for best results
2. **Profile Updates**: Keep your profile current with new skills and experience
3. **Feedback Loop**: Review generated materials and provide feedback for improvement
4. **Active Monitoring**: Regularly check your email and application statuses
5. **Customization**: Adjust settings based on your success patterns

---

**You're all set!** Your personal AI job search assistant is ready to help you transition from finance to social work with smart automation and personalized application materials.

Need help? Check the logs, review this guide, or modify the system to better fit your needs. The entire system is designed to be your personal productivity tool, so customize it as much as you want!

🚀 **Happy job hunting!**
