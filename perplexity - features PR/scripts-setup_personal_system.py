#!/usr/bin/env python3
"""
Personal CareerCopilot Setup Script
One-time setup for personal job search automation system
"""

import asyncio
import sys
import os
import json
from pathlib import Path
from typing import Dict, Any

# Add project root to path
sys.path.append(os.path.join(os.path.dirname(__file__), ".."))

from config.personal_config import PersonalCareerConfig, update_personal_config
from src.backend.utils.firebase_client import FirebaseClient


class PersonalSystemSetup:
    """Setup and configuration for personal CareerCopilot system"""

    def __init__(self):
        self.project_root = Path(__file__).parent.parent
        self.config = None

    def create_directory_structure(self):
        """Create necessary directories"""

        directories = [
            "logs",
            "data/templates",
            "data/user_profiles",
            "src/frontend/static/css",
            "src/frontend/static/js",
            "src/frontend/templates",
            "tests/fixtures",
        ]

        print("📁 Creating directory structure...")

        for directory in directories:
            dir_path = self.project_root / directory
            dir_path.mkdir(parents=True, exist_ok=True)
            print(f"  ✅ {directory}")

        # Create .gitkeep files for empty directories
        (self.project_root / "logs" / ".gitkeep").touch()

        print("✅ Directory structure created")

    def setup_environment(self):
        """Setup environment configuration"""

        print("\n⚙️ Setting up environment configuration...")

        # Check if .env exists
        env_file = self.project_root / ".env"
        env_example = self.project_root / ".env.example"

        if not env_file.exists() and env_example.exists():
            # Copy .env.example to .env
            with open(env_example, "r") as f:
                env_content = f.read()

            with open(env_file, "w") as f:
                f.write(env_content)

            print("  ✅ Created .env file from template")
            print("  ⚠️  Please edit .env with your actual API keys and credentials")
        else:
            print("  ✅ .env file already exists")

    def collect_personal_information(self) -> Dict[str, Any]:
        """Collect personal information from user"""

        print("\n👤 Personal Information Setup")
        print(
            "Please provide the following information for your personalized job search:"
        )
        print()

        name = input("Full Name [Your Name]: ").strip() or "Your Name"
        email = (
            input("Email [nishantdougall@gmail.com]: ").strip()
            or "nishantdougall@gmail.com"
        )
        location = (
            input("Location [Northcote, VIC, Australia]: ").strip()
            or "Northcote, VIC, Australia"
        )

        print("\n📈 Career Transition Details:")
        career_from = (
            input("Career transitioning FROM [Finance]: ").strip() or "Finance"
        )
        career_to = (
            input("Career transitioning TO [Social Work/Community Services]: ").strip()
            or "Social Work/Community Services"
        )

        print("\n🎯 Job Search Preferences:")
        print("Target roles (comma-separated):")
        roles_input = input(
            "  [Social Worker, Case Manager, Community Services Worker]: "
        ).strip()
        target_roles = (
            [role.strip() for role in roles_input.split(",")]
            if roles_input
            else ["Social Worker", "Case Manager", "Community Services Worker"]
        )

        print("\n💰 Salary Expectations (AUD):")
        try:
            salary_min = int(input("Minimum salary [60000]: ") or "60000")
            salary_max = int(input("Maximum salary [85000]: ") or "85000")
        except ValueError:
            salary_min, salary_max = 60000, 85000

        print("\n🤖 Automation Preferences:")
        daily_scan = input(
            "Enable daily job scanning? [Y/n]: "
        ).strip().lower() not in ["n", "no"]
        email_notifications = input(
            "Enable email notifications? [Y/n]: "
        ).strip().lower() not in ["n", "no"]

        return {
            "name": name,
            "email": email,
            "location": location,
            "career_transition_from": career_from,
            "career_transition_to": career_to,
            "target_roles": target_roles,
            "salary_range": {"min": salary_min, "max": salary_max, "currency": "AUD"},
            "daily_job_scan": daily_scan,
            "email_notifications": email_notifications,
        }

    def create_personal_profile(self, personal_info: Dict[str, Any]):
        """Create personal profile file"""

        print("\n📋 Creating personal profile...")

        profile_data = {
            "personal_info": {
                "name": personal_info["name"],
                "email": personal_info["email"],
                "location": personal_info["location"],
                "phone": "",
            },
            "career_transition": {
                "from": personal_info["career_transition_from"],
                "to": personal_info["career_transition_to"],
                "motivation": "Creating direct positive impact in communities",
                "story": {
                    "background": f"Experienced {personal_info['career_transition_from'].lower()} professional transitioning to {personal_info['career_transition_to'].lower()}",
                    "motivation": "Driven by desire to make direct positive impact in communities",
                    "unique_value": f"Brings analytical skills and professional experience from {personal_info['career_transition_from'].lower()} to social work practice",
                },
            },
            "experience": [
                {
                    "company": f"Previous {personal_info['career_transition_from']} Role",
                    "position": f"{personal_info['career_transition_from']} Professional",
                    "start_date": "2020-01-01",
                    "end_date": "2024-12-31",
                    "description": "Professional experience with analytical, communication, and client management skills",
                    "achievements": [
                        "Developed strong analytical and problem-solving capabilities",
                        "Built excellent client relationship and communication skills",
                        "Gained experience in project management and stakeholder coordination",
                    ],
                }
            ],
            "skills": [
                "Analytical Thinking",
                "Problem Solving",
                "Communication",
                "Client Relations",
                "Project Management",
                "Data Analysis",
                "Cultural Competency",
                "Empathy",
                "Active Listening",
            ],
            "education": [
                {
                    "institution": "University",
                    "degree": f"Degree in {personal_info['career_transition_from']}",
                    "graduation_year": "2019",
                    "relevant_coursework": [],
                }
            ],
            "preferences": {
                "target_roles": personal_info["target_roles"],
                "locations": [personal_info["location"], "Remote", "Hybrid"],
                "salary_range": personal_info["salary_range"],
                "work_types": ["full_time", "part_time"],
            },
            "automation_settings": {
                "daily_job_scan": personal_info["daily_job_scan"],
                "email_notifications": personal_info["email_notifications"],
                "morning_scan_time": "09:00",
            },
        }

        # Save profile
        profile_file = (
            self.project_root / "data" / "user_profiles" / "personal_profile.json"
        )
        with open(profile_file, "w") as f:
            json.dump(profile_data, f, indent=2)

        print("  ✅ Personal profile created")

        return profile_data

    def create_document_templates(self):
        """Create document templates"""

        print("\n📄 Creating document templates...")

        # Resume template
        resume_template = """
# {name} - Resume

## Contact Information
- **Name:** {name}
- **Email:** {email}
- **Location:** {location}
- **Phone:** {phone}

## Professional Summary
{career_transition_from} professional transitioning to {career_transition_to} with strong analytical, communication, and client relationship skills. Motivated by desire to create direct positive impact in communities.

## Experience
{experience_section}

## Skills
### Transferable Skills
{transferable_skills}

### Developing Skills
{social_work_skills}

## Education
{education_section}

## Additional Information
- **Career Motivation:** {career_motivation}
- **Values:** Community empowerment, social justice, cultural competency
- **Languages:** English (native)
        """

        # Cover letter template
        cover_letter_template = """
Dear Hiring Manager,

I am writing to express my strong interest in the {job_title} position at {company_name}. As a {career_transition_from} professional transitioning to {career_transition_to}, I am excited about the opportunity to bring my analytical skills and passion for community impact to your organization.

## Why {company_name}
{company_specific_reasons}

## My Background & Relevant Experience
Through my experience in {career_transition_from}, I have developed:
- Strong analytical and problem-solving capabilities
- Excellent client relationship and communication skills
- Project management and stakeholder coordination experience
- Cultural competency and understanding of diverse communities

## How I Can Contribute
{specific_contributions}

I am particularly drawn to this role because:
{role_specific_interest}

Thank you for considering my application. I would welcome the opportunity to discuss how my unique background and passion for {career_transition_to} can contribute to {company_name}'s mission.

Sincerely,
{name}
        """

        # Save templates
        templates_dir = self.project_root / "data" / "templates"

        with open(templates_dir / "resume_template.txt", "w") as f:
            f.write(resume_template)

        with open(templates_dir / "cover_letter_template.txt", "w") as f:
            f.write(cover_letter_template)

        print("  ✅ Document templates created")

    async def setup_firebase(self, personal_info: Dict[str, Any]):
        """Initialize Firebase with personal data"""

        print("\n🔥 Setting up Firebase integration...")

        try:
            firebase_client = FirebaseClient()

            # Create initial user profile in Firestore
            await firebase_client.save_user_profile("personal_user", personal_info)

            print("  ✅ Firebase profile created")

        except Exception as e:
            print(f"  ⚠️  Firebase setup failed: {e}")
            print("  💡 You can set this up later by configuring Firebase credentials")

    def create_gitignore(self):
        """Create .gitignore file"""

        gitignore_content = """
# Environment and secrets
.env
.env.local
.env.production
firebase-credentials.json
google-credentials.json

# Python
__pycache__/
*.py[cod]
*$py.class
*.so
.Python
env/
venv/
ENV/
env.bak/
venv.bak/
.venv

# Logs
logs/*.log
*.log

# Database
*.db
*.sqlite
*.sqlite3

# Cache
.cache/
*.cache

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# macOS
.DS_Store

# Personal data
data/user_profiles/*.json
data/documents/
data/cache/

# Temporary files
tmp/
temp/
*.tmp

# Distribution / packaging
.Python
build/
develop-eggs/
dist/
downloads/
eggs/
.eggs/
lib/
lib64/
parts/
sdist/
var/
wheels/
share/python-wheels/
*.egg-info/
.installed.cfg
*.egg
MANIFEST

# Testing
.pytest_cache/
.coverage
htmlcov/
.tox/
.nox/

# Jupyter Notebook
.ipynb_checkpoints

# pyenv
.python-version
        """

        gitignore_file = self.project_root / ".gitignore"
        with open(gitignore_file, "w") as f:
            f.write(gitignore_content.strip())

        print("✅ .gitignore created")

    async def run_setup(self):
        """Run complete system setup"""

        print("🚀 CareerCopilot Personal Edition Setup")
        print("=" * 50)

        try:
            # 1. Create directories
            self.create_directory_structure()

            # 2. Setup environment
            self.setup_environment()

            # 3. Collect personal information
            personal_info = self.collect_personal_information()

            # 4. Create personal profile
            self.create_personal_profile(personal_info)

            # 5. Create document templates
            self.create_document_templates()

            # 6. Setup Firebase (optional)
            await self.setup_firebase(personal_info)

            # 7. Create .gitignore
            self.create_gitignore()

            print("\n" + "=" * 50)
            print("✅ Setup Complete!")
            print()
            print("🎯 Next Steps:")
            print("1. Edit .env with your API keys (Gemini, Firebase, Gmail)")
            print("2. Test the system: python scripts/daily_job_scan.py")
            print("3. Start the web interface: python src/backend/main.py")
            print(
                "4. Set up daily automation: python scripts/daily_job_scan.py --setup-cron"
            )
            print()
            print(
                "📚 Documentation: Check docs/ folder for detailed setup instructions"
            )
            print("🆘 Support: Review README.md for troubleshooting")

        except KeyboardInterrupt:
            print("\n⚠️ Setup cancelled by user")

        except Exception as e:
            print(f"\n❌ Setup failed: {str(e)}")
            raise


async def main():
    """Main setup entry point"""

    setup = PersonalSystemSetup()
    await setup.run_setup()


if __name__ == "__main__":
    asyncio.run(main())
