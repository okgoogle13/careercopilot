# 1. Use the official, required Python version
FROM python:3.11-slim

# 2. Set a consistent working directory
WORKDIR /app

# 3. Copy only the requirements file first to leverage Docker layer caching
COPY ./requirements.txt /app/requirements.txt
COPY ./requirements.lock /app/requirements.lock

# 4. Install the dependencies
RUN pip install --no-cache-dir -r requirements.lock

# 5. Copy the entire application source code into the container
COPY ./app /app/app

# 6. Expose the port the app runs on
EXPOSE 8080

# Original startup command, temporarily disabled for debugging
# CMD ["python", "-m", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8080"]

# --- TEMPORARY DEBUGGING COMMAND ---
# This command keeps the container alive so we can get a shell inside it.
CMD ["sh", "-c", "echo 'Container is in debug mode. Keeping alive...' && while true; do sleep 3600; done"]
