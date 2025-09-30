# Stage 1: Builder
# This stage installs all dependencies, including build-time tools.
FROM python:3.11-slim as builder

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=off \
    PIP_DISABLE_PIP_VERSION_CHECK=on \
    PIP_DEFAULT_TIMEOUT=100

# Install system dependencies required for building Python packages
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    libffi-dev \
    libssl-dev \
    libpq-dev \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install Python build dependencies
RUN pip install --upgrade pip wheel

WORKDIR /app

# Copy and install Python dependencies
COPY requirements.txt .
RUN pip wheel --no-cache-dir --wheel-dir=/app/wheels -r requirements.txt


# Stage 2: Production
# This is the final, lean image for production.
FROM python:3.11-slim as production

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PYTHONPATH=/app:/app/app

# Install only necessary runtime system dependencies
RUN apt-get update && apt-get install -y \
    libpq-dev \
    curl \
    libglib2.0-0 \
    libpango-1.0-0 \
    libcairo2 \
    fontconfig \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy installed packages from the builder stage
COPY --from=builder /app/wheels /wheels
RUN pip install --no-cache --no-index --find-links=/wheels /wheels/*

# Create a non-root user for security
RUN groupadd -r appuser && useradd --no-log-init -r -g appuser appuser

# Copy requirements first for better caching (already handled in builder stage)
# Copy application code last to maximize cache efficiency
COPY . .

# Ensure startup script is executable and owned by appuser
RUN chmod +x /app/start.sh

# Create and set permissions for necessary directories
RUN mkdir -p data/cache/{ai_operations,ai_responses,general,jobs,profiles,research} logs migrations/versions && \
    chown -R appuser:appuser /app && \
    chown appuser:appuser /app/start.sh

# Switch to the non-root user
USER appuser

# Expose the application port (Cloud Run uses PORT env variable)
EXPOSE 8080

# Health check for container orchestration
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8080/health || exit 1

# Default command to run the application in production
# Use ENTRYPOINT to ensure the startup script is executed
ENTRYPOINT ["/app/start.sh"]


# Stage 3: Development
# This stage is for local development with hot-reloading.
FROM builder as development

WORKDIR /app

# Install development dependencies and application packages
RUN pip install --no-cache-dir -r requirements.txt

# Switch to a non-root user
RUN groupadd -r appuser && useradd --no-log-init -r -g appuser appuser
USER appuser

# Expose the application port
EXPOSE 8000

# Default command for development with hot-reloading
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
