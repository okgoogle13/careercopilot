"""
Performance testing for AI services
"""

import json
import statistics
import time
from typing import Any, Dict, List

import gevent
import pytest
from locust import HttpUser, between, task
from locust.env import Environment
from locust.log import setup_logging
from locust.stats import stats_history, stats_printer

# Test data
SAMPLE_RESUME = """
John Doe
Senior Software Engineer
San Francisco, CA | johndoe@email.com | (555) 123-4567

SUMMARY
Senior Software Engineer with 8+ years of experience...
"""

SAMPLE_JOB_DESCRIPTION = """
We are looking for a Senior Software Engineer with experience in Python and cloud technologies.
"""


class AIUser(HttpUser):
    wait_time = between(1, 3)

    def on_start(self):
        """Login and get auth token"""
        response = self.client.post(
            "/api/auth/login", json={"email": "test@example.com", "password": "testpassword"}
        )
        self.token = response.json().get("access_token")
        self.headers = {"Authorization": f"Bearer {self.token}", "Content-Type": "application/json"}

    @task
    def analyze_resume(self):
        """Test resume analysis endpoint"""
        payload = {"resume_content": SAMPLE_RESUME, "target_industry": "Technology"}
        self.client.post("/api/v1/ai/resume/analyze", json=payload, headers=self.headers)

    @task(2)  # Higher weight = more frequent execution
    def generate_cover_letter(self):
        """Test cover letter generation"""
        payload = {
            "candidate_profile": {"name": "John Doe", "email": "john@example.com"},
            "job_description": SAMPLE_JOB_DESCRIPTION,
            "style": "professional",
        }
        self.client.post("/api/v1/ai/cover-letter/generate", json=payload, headers=self.headers)


def run_performance_test(users: int = 10, spawn_rate: int = 1, duration: int = 60):
    """Run performance test and return results"""
    # Setup
    setup_logging("INFO", None)
    env = Environment(user_classes=[AIUser])
    env.create_local_runner()

    # Start test
    print(f"Starting performance test with {users} users...")
    env.runner.start(users, spawn_rate=spawn_rate)

    # Start a greenlet that periodically outputs the current stats
    gevent.spawn(stats_printer(env.stats))

    # Run for the specified duration
    gevent.spawn_later(duration, lambda: env.runner.quit())
    env.runner.greenlet.join()

    # Collect results
    results = {
        "total_requests": env.stats.total.num_requests,
        "fail_ratio": env.stats.total.fail_ratio,
        "avg_response_time": env.stats.total.avg_response_time,
        "requests_per_second": env.stats.total.total_rps,
        "response_times": {
            "min": env.stats.total.min_response_time,
            "median": env.stats.total.median_response_time,
            "max": env.stats.total.max_response_time,
            "p95": env.stats.total.get_response_time_percentile(0.95),
            "p99": env.stats.total.get_response_time_percentile(0.99),
        },
    }

    return results


if __name__ == "__main__":
    # Example test configuration
    test_configs = [
        {"users": 10, "spawn_rate": 1, "duration": 60},  # Light load
        {"users": 50, "spawn_rate": 5, "duration": 120},  # Medium load
        {"users": 100, "spawn_rate": 10, "duration": 180},  # Heavy load
    ]

    all_results = []

    for config in test_configs:
        print(f"\nRunning test with {config['users']} users...")
        result = run_performance_test(**config)
        all_results.append({"config": config, "results": result})

    # Save results to file
    with open("performance_test_results.json", "w") as f:
        json.dump(all_results, f, indent=2)

    print("\nPerformance test completed. Results saved to performance_test_results.json")
