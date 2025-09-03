"""
Firebase Client for Personal CareerCopilot
Simplified Firebase integration for single-user system
"""

import os
import json
import asyncio
import logging
from datetime import datetime
from typing import Dict, Any, List, Optional

try:
    import firebase_admin
    from firebase_admin import credentials, firestore, storage
    FIREBASE_AVAILABLE = True
except ImportError:
    FIREBASE_AVAILABLE = False

logger = logging.getLogger(__name__)

class FirebaseClient:
    """Simplified Firebase client for personal use"""

    def __init__(self):
        self.db = None
        self.bucket = None
        self.initialized = False

        if FIREBASE_AVAILABLE:
            self._initialize_firebase()
        else:
            logger.warning("Firebase SDK not available. Install with: pip install firebase-admin")

    def _initialize_firebase(self):
        """Initialize Firebase connection"""

        try:
            # Get credentials path
            credentials_path = os.getenv('FIREBASE_CREDENTIALS_PATH')
            project_id = os.getenv('FIREBASE_PROJECT_ID')

            if not credentials_path or not project_id:
                logger.warning("Firebase credentials not configured. Set FIREBASE_CREDENTIALS_PATH and FIREBASE_PROJECT_ID")
                return

            # Check if already initialized
            if not firebase_admin._apps:
                # Initialize Firebase
                cred = credentials.Certificate(credentials_path)
                firebase_admin.initialize_app(cred, {
                    'projectId': project_id,
                    'storageBucket': f'{project_id}.appspot.com'
                })

            # Get Firestore client
            self.db = firestore.client()

            # Get Storage client
            self.bucket = storage.bucket()

            self.initialized = True
            logger.info("Firebase initialized successfully")

        except Exception as e:
            logger.error(f"Firebase initialization failed: {e}")
            self.initialized = False

    def _check_initialized(self):
        """Check if Firebase is properly initialized"""

        if not self.initialized:
            raise RuntimeError("Firebase not initialized. Check credentials and configuration.")

    # User Profile Operations

    async def get_user_profile(self, user_id: str) -> Optional[Dict[str, Any]]:
        """Get user profile from Firestore"""

        if not self.initialized:
            # Return None if Firebase not available (graceful degradation)
            return None

        try:
            doc_ref = self.db.collection('users').document(user_id)
            doc = doc_ref.get()

            if doc.exists:
                profile_data = doc.to_dict()
                logger.info(f"User profile loaded for {user_id}")
                return profile_data
            else:
                logger.info(f"No profile found for user {user_id}")
                return None

        except Exception as e:
            logger.error(f"Failed to get user profile: {e}")
            return None

    async def save_user_profile(self, user_id: str, profile_data: Dict[str, Any]) -> bool:
        """Save user profile to Firestore"""

        if not self.initialized:
            # Save to local file as fallback
            return await self._save_profile_locally(user_id, profile_data)

        try:
            doc_ref = self.db.collection('users').document(user_id)

            # Add metadata
            profile_data.update({
                'last_updated': datetime.now().isoformat(),
                'updated_by': 'personal_system'
            })

            doc_ref.set(profile_data, merge=True)
            logger.info(f"User profile saved for {user_id}")
            return True

        except Exception as e:
            logger.error(f"Failed to save user profile: {e}")
            return False

    async def _save_profile_locally(self, user_id: str, profile_data: Dict[str, Any]) -> bool:
        """Fallback: save profile to local file"""

        try:
            from pathlib import Path

            profiles_dir = Path('data/user_profiles')
            profiles_dir.mkdir(exist_ok=True)

            profile_file = profiles_dir / f'{user_id}_profile.json'

            with open(profile_file, 'w') as f:
                json.dump(profile_data, f, indent=2, default=str)

            logger.info(f"User profile saved locally for {user_id}")
            return True

        except Exception as e:
            logger.error(f"Failed to save profile locally: {e}")
            return False

    # Job and Application Operations

    async def save_job_opportunity(self, user_id: str, job_data: Dict[str, Any]) -> bool:
        """Save job opportunity to Firestore"""

        if not self.initialized:
            return True  # Graceful degradation

        try:
            doc_ref = self.db.collection('users').document(user_id).collection('jobs').document()

            job_data.update({
                'created_at': datetime.now().isoformat(),
                'user_id': user_id
            })

            doc_ref.set(job_data)
            logger.info(f"Job opportunity saved: {job_data.get('title', 'Unknown')}")
            return True

        except Exception as e:
            logger.error(f"Failed to save job opportunity: {e}")
            return False

    async def get_job_opportunities(self, user_id: str, limit: int = 50) -> List[Dict[str, Any]]:
        """Get job opportunities for user"""

        if not self.initialized:
            return []

        try:
            query = (self.db.collection('users')
                    .document(user_id)
                    .collection('jobs')
                    .order_by('created_at', direction=firestore.Query.DESCENDING)
                    .limit(limit))

            docs = query.stream()

            jobs = []
            for doc in docs:
                job_data = doc.to_dict()
                job_data['id'] = doc.id
                jobs.append(job_data)

            logger.info(f"Retrieved {len(jobs)} job opportunities for {user_id}")
            return jobs

        except Exception as e:
            logger.error(f"Failed to get job opportunities: {e}")
            return []

    async def save_application(self, user_id: str, application_data: Dict[str, Any]) -> bool:
        """Save job application to Firestore"""

        if not self.initialized:
            return True

        try:
            doc_ref = self.db.collection('users').document(user_id).collection('applications').document()

            application_data.update({
                'created_at': datetime.now().isoformat(),
                'user_id': user_id,
                'last_updated': datetime.now().isoformat()
            })

            doc_ref.set(application_data)
            logger.info(f"Application saved: {application_data.get('job_title', 'Unknown')}")
            return True

        except Exception as e:
            logger.error(f"Failed to save application: {e}")
            return False

    async def get_applications(self, user_id: str, limit: int = 50) -> List[Dict[str, Any]]:
        """Get applications for user"""

        if not self.initialized:
            return []

        try:
            query = (self.db.collection('users')
                    .document(user_id)
                    .collection('applications')
                    .order_by('created_at', direction=firestore.Query.DESCENDING)
                    .limit(limit))

            docs = query.stream()

            applications = []
            for doc in docs:
                app_data = doc.to_dict()
                app_data['id'] = doc.id
                applications.append(app_data)

            logger.info(f"Retrieved {len(applications)} applications for {user_id}")
            return applications

        except Exception as e:
            logger.error(f"Failed to get applications: {e}")
            return []

    # Company Research Operations

    async def save_company_research(self, user_id: str, company_name: str, research_data: Dict[str, Any]) -> bool:
        """Save company research data"""

        if not self.initialized:
            return True

        try:
            doc_ref = (self.db.collection('users')
                      .document(user_id)
                      .collection('company_research')
                      .document(company_name.lower().replace(' ', '_')))

            research_data.update({
                'created_at': datetime.now().isoformat(),
                'user_id': user_id,
                'company_name': company_name
            })

            doc_ref.set(research_data, merge=True)
            logger.info(f"Company research saved: {company_name}")
            return True

        except Exception as e:
            logger.error(f"Failed to save company research: {e}")
            return False

    async def get_company_research(self, user_id: str, company_name: str) -> Optional[Dict[str, Any]]:
        """Get company research data"""

        if not self.initialized:
            return None

        try:
            doc_ref = (self.db.collection('users')
                      .document(user_id)
                      .collection('company_research')
                      .document(company_name.lower().replace(' ', '_')))

            doc = doc_ref.get()

            if doc.exists:
                research_data = doc.to_dict()
                logger.info(f"Company research retrieved: {company_name}")
                return research_data
            else:
                return None

        except Exception as e:
            logger.error(f"Failed to get company research: {e}")
            return None

    # Learning and Analytics Operations

    async def save_learning_data(self, user_id: str, agent_name: str, learning_data: Dict[str, Any]) -> bool:
        """Save agent learning data"""

        if not self.initialized:
            return True

        try:
            doc_ref = (self.db.collection('users')
                      .document(user_id)
                      .collection('agent_learning')
                      .document(agent_name))

            learning_data.update({
                'last_updated': datetime.now().isoformat(),
                'user_id': user_id,
                'agent_name': agent_name
            })

            doc_ref.set(learning_data, merge=True)
            logger.info(f"Learning data saved for agent: {agent_name}")
            return True

        except Exception as e:
            logger.error(f"Failed to save learning data: {e}")
            return False

    async def get_learning_data(self, user_id: str, agent_name: str) -> Optional[Dict[str, Any]]:
        """Get agent learning data"""

        if not self.initialized:
            return None

        try:
            doc_ref = (self.db.collection('users')
                      .document(user_id)
                      .collection('agent_learning')
                      .document(agent_name))

            doc = doc_ref.get()

            if doc.exists:
                return doc.to_dict()
            else:
                return None

        except Exception as e:
            logger.error(f"Failed to get learning data: {e}")
            return None

    # Document Storage Operations

    async def upload_document(self, user_id: str, document_content: str,
                            filename: str) -> Optional[str]:
        """Upload document to Firebase Storage"""

        if not self.initialized or not self.bucket:
            return None

        try:
            blob_path = f"users/{user_id}/documents/{filename}"
            blob = self.bucket.blob(blob_path)

            blob.upload_from_string(
                document_content,
                content_type='text/plain'
            )

            # Make blob publicly readable (optional)
            blob.make_public()

            logger.info(f"Document uploaded: {filename}")
            return blob.public_url

        except Exception as e:
            logger.error(f"Failed to upload document: {e}")
            return None

    async def download_document(self, user_id: str, filename: str) -> Optional[str]:
        """Download document from Firebase Storage"""

        if not self.initialized or not self.bucket:
            return None

        try:
            blob_path = f"users/{user_id}/documents/{filename}"
            blob = self.bucket.blob(blob_path)

            if blob.exists():
                content = blob.download_as_text()
                logger.info(f"Document downloaded: {filename}")
                return content
            else:
                return None

        except Exception as e:
            logger.error(f"Failed to download document: {e}")
            return None

    # Utility Methods

    async def get_user_stats(self, user_id: str) -> Dict[str, Any]:
        """Get user statistics"""

        if not self.initialized:
            return {"error": "Firebase not available"}

        try:
            # Get counts from various collections
            jobs_count = len(await self.get_job_opportunities(user_id))
            apps_count = len(await self.get_applications(user_id))

            return {
                "jobs_discovered": jobs_count,
                "applications_submitted": apps_count,
                "last_updated": datetime.now().isoformat()
            }

        except Exception as e:
            logger.error(f"Failed to get user stats: {e}")
            return {"error": str(e)}

    async def cleanup_old_data(self, user_id: str, days_old: int = 30) -> int:
        """Clean up old data older than specified days"""

        if not self.initialized:
            return 0

        try:
            cutoff_date = datetime.now().timestamp() - (days_old * 24 * 3600)

            # This would require implementing date filtering
            # For now, just return 0
            logger.info(f"Data cleanup would remove items older than {days_old} days")
            return 0

        except Exception as e:
            logger.error(f"Failed to cleanup old data: {e}")
            return 0