# ===== Base Stage =====
# Use a specific, slim Python version for a smaller base
# Using mirror.gcr.io to avoid Docker Hub rate limits and outages
FROM mirror.gcr.io/library/python:3.13-slim AS base

# Set environment variables for consistency
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
ENV PIP_NO_CACHE_DIR off
ENV PIP_DISABLE_PIP_VERSION_CHECK on

# Set the working directory
WORKDIR /app

# Install curl for healthchecks and system dependencies if any (e.g., for psycopg2)
RUN apt-get update && apt-get install -y --no-install-recommends curl && rm -rf /var/lib/apt/lists/*

# Copy only the requirements file first to leverage Docker cache
COPY requirements.txt .

# Install production dependencies
RUN pip install --no-cache-dir -r requirements.txt

# ===== Test Stage =====
# This stage includes test-specific dependencies
FROM base AS test

# Install additional dependencies for testing
RUN pip install --no-cache-dir \
    "pytest>=8.0.0" \
    "pytest-cov>=4.1.0" \
    "pytest-asyncio>=0.23.0" \
    "httpx>=0.27.0" \
    "requests>=2.31.0" \
    "mypy>=1.8.0" \
    "flake8>=7.0.0" \
    "bandit>=1.7.6" \
    "black>=24.0.0" \
    "prometheus-client>=0.19.0"

# Copy the rest of the application code
COPY . .

# Default command for running tests
CMD ["python", "-m", "pytest", "app/tests/", "-v", "--tb=short", "--maxfail=5", "--disable-warnings", "--cov=app", "--cov-report=xml", "--cov-report=html:htmlcov"]

# ===== Final/Production Stage =====
# Start from the clean base stage
FROM base AS final

# Copy the application code
COPY . .

# Expose the port the app runs on
EXPOSE 8080

# Command to run the application
ENTRYPOINT ["/app/start.sh"]
