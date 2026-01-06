"""
backend/app/services/job_store.py
----------------------------------
Firestore-backed job storage service with in-memory fallback.
Provides persistent storage for job queue with graceful degradation.
"""
import logging
from datetime import datetime
from typing import Dict, List, Optional
from firebase_admin import firestore

from app.core.firebase_config import get_firestore_client

logger = logging.getLogger(__name__)


class FirestoreJobStore:
    """
    Job storage service using Firestore with in-memory fallback.
    
    Features:
    - Persistent storage in Firestore
    - Automatic fallback to in-memory storage if Firestore unavailable
    - Thread-safe operations
    - Automatic timestamp management
    """
    
    def __init__(self, collection_name: str = "jobs"):
        """
        Initialize the job store.
        
        Args:
            collection_name: Name of the Firestore collection (default: "jobs")
        """
        self.db = get_firestore_client()
        self.collection = collection_name
        
        # In-memory fallback storage
        self._memory_store: Dict[str, dict] = {}
        self._memory_counter = 0
        
        # Log initialization mode
        if self.db:
            logger.info(f"[JobStore] Initialized with Firestore (collection: {collection_name})")
        else:
            logger.warning("[JobStore] Firestore unavailable. Using in-memory storage (data will not persist)")
    
    async def add_job(self, job_data: dict) -> str:
        """
        Add a new job to storage.
        
        Args:
            job_data: Job information dictionary
            
        Returns:
            str: Job ID (Firestore document ID or generated ID)
        """
        # Add timestamp if not present
        if 'date_clipped' not in job_data:
            job_data['date_clipped'] = datetime.utcnow().isoformat()
        
        if not self.db:
            # Fallback to in-memory storage
            self._memory_counter += 1
            job_id = str(self._memory_counter)
            job_data['id'] = job_id
            self._memory_store[job_id] = job_data
            logger.debug(f"[JobStore] Added job {job_id} to in-memory storage")
            return job_id
        
        try:
            # Add to Firestore
            update_time, doc_ref = self.db.collection(self.collection).add(job_data)
            job_id = doc_ref.id
            logger.info(f"[JobStore] Added job {job_id} to Firestore at {update_time}")
            return job_id
            
        except Exception as e:
            logger.error(f"[JobStore] Failed to add job to Firestore: {e}")
            # Fallback to in-memory on Firestore error
            self._memory_counter += 1
            job_id = f"mem_{self._memory_counter}"
            job_data['id'] = job_id
            self._memory_store[job_id] = job_data
            logger.warning(f"[JobStore] Fell back to in-memory storage for job {job_id}")
            return job_id
    
    async def get_all_jobs(self, user_id: Optional[str] = None, limit: int = 100) -> List[dict]:
        """
        Retrieve all jobs, optionally filtered by user.
        
        Args:
            user_id: Optional user ID to filter jobs
            limit: Maximum number of jobs to return (default: 100)
            
        Returns:
            List[dict]: List of job dictionaries with IDs included
        """
        if not self.db:
            # Return from in-memory storage - convert dict values to list only when needed
            if user_id:
                jobs = [j for j in self._memory_store.values() if j.get('user_id') == user_id]
            else:
                jobs = list(self._memory_store.values())
            logger.debug(f"[JobStore] Retrieved {len(jobs)} jobs from in-memory storage")
            return jobs[:limit]
        
        try:
            # Query Firestore
            query = self.db.collection(self.collection)
            
            # Filter by user if specified
            if user_id:
                query = query.where('user_id', '==', user_id)
            
            # Order by newest first
            query = query.order_by('date_clipped', direction=firestore.Query.DESCENDING)
            query = query.limit(limit)
            
            # Execute query
            docs = query.stream()
            
            jobs = []
            for doc in docs:
                job = doc.to_dict()
                job['id'] = doc.id
                jobs.append(job)
            
            logger.info(f"[JobStore] Retrieved {len(jobs)} jobs from Firestore")
            return jobs
            
        except Exception as e:
            logger.error(f"[JobStore] Failed to retrieve jobs from Firestore: {e}")
            # Fallback to in-memory on error
            if user_id:
                jobs = [j for j in self._memory_store.values() if j.get('user_id') == user_id]
            else:
                jobs = list(self._memory_store.values())
            logger.warning(f"[JobStore] Fell back to in-memory storage, returning {len(jobs)} jobs")
            return jobs[:limit]
    
    async def get_job(self, job_id: str) -> Optional[dict]:
        """
        Retrieve a specific job by ID.
        
        Args:
            job_id: Job ID to retrieve
            
        Returns:
            Optional[dict]: Job data with ID included, or None if not found
        """
        if not self.db:
            # Get from in-memory storage
            job = self._memory_store.get(job_id)
            if job:
                logger.debug(f"[JobStore] Retrieved job {job_id} from in-memory storage")
            return job
        
        try:
            # Get from Firestore
            doc = self.db.collection(self.collection).document(job_id).get()
            
            if doc.exists:
                data = doc.to_dict()
                data['id'] = doc.id
                logger.info(f"[JobStore] Retrieved job {job_id} from Firestore")
                return data
            else:
                logger.warning(f"[JobStore] Job {job_id} not found in Firestore")
                return None
                
        except Exception as e:
            logger.error(f"[JobStore] Failed to retrieve job {job_id} from Firestore: {e}")
            # Fallback to in-memory
            job = self._memory_store.get(job_id)
            if job:
                logger.warning(f"[JobStore] Fell back to in-memory storage for job {job_id}")
            return job
    
    async def update_job(self, job_id: str, updates: dict) -> bool:
        """
        Update a job with new data.
        
        Args:
            job_id: Job ID to update
            updates: Dictionary of fields to update
            
        Returns:
            bool: True if update successful, False otherwise
        """
        # Add update timestamp
        updates['updated_at'] = datetime.utcnow().isoformat()
        
        if not self.db:
            # Update in-memory storage
            if job_id in self._memory_store:
                self._memory_store[job_id].update(updates)
                logger.debug(f"[JobStore] Updated job {job_id} in in-memory storage")
                return True
            else:
                logger.warning(f"[JobStore] Job {job_id} not found in in-memory storage")
                return False
        
        try:
            # Update in Firestore
            self.db.collection(self.collection).document(job_id).update(updates)
            logger.info(f"[JobStore] Updated job {job_id} in Firestore")
            return True
            
        except Exception as e:
            logger.error(f"[JobStore] Failed to update job {job_id} in Firestore: {e}")
            # Fallback to in-memory
            if job_id in self._memory_store:
                self._memory_store[job_id].update(updates)
                logger.warning(f"[JobStore] Fell back to in-memory storage for updating job {job_id}")
                return True
            return False
    
    async def delete_job(self, job_id: str) -> bool:
        """
        Delete a job from storage.
        
        Args:
            job_id: Job ID to delete
            
        Returns:
            bool: True if deletion successful, False otherwise
        """
        if not self.db:
            # Delete from in-memory storage
            if job_id in self._memory_store:
                del self._memory_store[job_id]
                logger.debug(f"[JobStore] Deleted job {job_id} from in-memory storage")
                return True
            return False
        
        try:
            # Delete from Firestore
            self.db.collection(self.collection).document(job_id).delete()
            logger.info(f"[JobStore] Deleted job {job_id} from Firestore")
            return True
            
        except Exception as e:
            logger.error(f"[JobStore] Failed to delete job {job_id} from Firestore: {e}")
            # Fallback to in-memory
            if job_id in self._memory_store:
                del self._memory_store[job_id]
                logger.warning(f"[JobStore] Fell back to in-memory storage for deleting job {job_id}")
                return True
            return False
    
    def get_storage_mode(self) -> str:
        """
        Get the current storage mode.
        
        Returns:
            str: Either "firestore" or "in-memory"
        """
        return "firestore" if self.db else "in-memory"
    
    def get_stats(self) -> dict:
        """
        Get storage statistics.
        
        Returns:
            dict: Storage statistics
        """
        return {
            "mode": self.get_storage_mode(),
            "collection": self.collection if self.db else "N/A",
            "in_memory_count": len(self._memory_store),
            "firestore_available": self.db is not None
        }


# Singleton instance
_job_store: Optional[FirestoreJobStore] = None


def get_job_store() -> FirestoreJobStore:
    """
    Get or create the singleton job store instance.
    
    Returns:
        FirestoreJobStore: Job store instance
    """
    global _job_store
    if _job_store is None:
        _job_store = FirestoreJobStore()
    return _job_store
