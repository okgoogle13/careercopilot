import logging
from datetime import datetime

from app.core.firebase import get_firestore

logger = logging.getLogger(__name__)


class FirestoreJobStore:
    """
    Job storage service using Firestore.
    Replaces SQLAlchemyJobStore.
    """

    def __init__(self):
        """
        Initialize the job store with Firestore.
        """
        self.collection_name = "jobs"

    async def add_job(self, job_data: dict) -> str:
        """
        Add a new job to storage.
        """
        # Ensure user_id is present
        if "user_id" not in job_data:
            raise ValueError("user_id is required to add a job")

        # Add timestamp if not present
        if "date_clipped" not in job_data:
            job_data["date_clipped"] = datetime.utcnow().isoformat()

        if "created_at" not in job_data:
            job_data["created_at"] = datetime.utcnow().isoformat()

        db = get_firestore()
        col = db.collection(self.collection_name)

        # Determine ID or let Firestore generate it
        if job_data.get("id"):
            doc_ref = col.document(job_data["id"])
        else:
            doc_ref = col.document()
            job_data["id"] = doc_ref.id

        doc_ref.set(job_data)
        logger.info(f"[JobStore] Added job {doc_ref.id} to Firestore")
        return doc_ref.id

    async def get_all_jobs(self, user_id: str | None = None, limit: int = 100) -> list[dict]:
        """
        Retrieve all jobs.
        """
        db = get_firestore()
        col = db.collection(self.collection_name)

        query = col
        if user_id:
            query = query.where("user_id", "==", user_id)

        # Optional ordering, Firestore needs compound indexes for where+order_by sometimes,
        # so let's just retrieve and sort. Or rely on index if existing.
        query = query.limit(limit)

        docs = query.stream()
        jobs = []
        for doc in docs:
            d = doc.to_dict()
            d["id"] = doc.id
            jobs.append(d)

        # Sort in memory as fallback for lacking compound indexes
        jobs.sort(key=lambda x: x.get("created_at", ""), reverse=True)
        return jobs

    async def get_job(self, job_id: str) -> dict | None:
        """
        Retrieve a specific job by ID.
        """
        db = get_firestore()
        doc = db.collection(self.collection_name).document(job_id).get()
        if doc.exists:
            d = doc.to_dict()
            d["id"] = doc.id
            return d
        return None

    async def update_job(self, job_id: str, updates: dict) -> bool:
        """
        Update a job with new data.
        """
        db = get_firestore()
        doc_ref = db.collection(self.collection_name).document(job_id)
        if not doc_ref.get().exists:
            return False

        doc_ref.update(updates)
        return True

    async def delete_job(self, job_id: str) -> bool:
        """
        Delete a job from storage.
        """
        db = get_firestore()
        doc_ref = db.collection(self.collection_name).document(job_id)
        if not doc_ref.get().exists:
            return False

        doc_ref.delete()
        return True

    def get_storage_mode(self) -> str:
        """Return the active backing store identifier."""
        return "firestore"

    def get_stats(self) -> dict[str, int | str]:
        """Return lightweight storage metadata for monitoring endpoints."""
        db = get_firestore()
        # count is expensive but we can use aggregate query if needed
        # Fallback to rough estimate or simply fetch
        aggregation = db.collection(self.collection_name).count()
        query = aggregation.get()
        count_val = query[0][0].value if query else "unknown"

        return {
            "mode": self.get_storage_mode(),
            "count": count_val,
        }


# Helper for dependency injection
def get_job_store() -> FirestoreJobStore:
    return FirestoreJobStore()
