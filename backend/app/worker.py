"""
Celery Worker Configuration for CareerCopilot.

This module initializes and configures the Celery application instance, which is
used to run background tasks asynchronously. It sets up the broker (Redis),
result backend, and other important operational parameters.

The `celery_app` instance created here is imported by other parts of the application
to define and dispatch background tasks. Tasks are auto-discovered from the
`app.workers` module.
"""
import os

from celery import Celery

# Create Celery instance
celery_app = Celery("careercopilot")

# Configure Celery
celery_app.conf.update(
    broker_url=os.getenv("REDIS_URL", "redis://localhost:6379/0"),
    result_backend=os.getenv("REDIS_URL", "redis://localhost:6379/0"),
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
    task_track_started=True,
    task_time_limit=30 * 60,
    task_soft_time_limit=25 * 60,
    worker_prefetch_multiplier=1,
    worker_max_tasks_per_child=1000,
)

# Auto-discover tasks
celery_app.autodiscover_tasks(["app.workers"])

if __name__ == "__main__":
    celery_app.start()
