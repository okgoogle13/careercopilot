# Use an official Python runtime as a parent image
FROM python:3.13-slim

# Set the working directory in the container
WORKDIR /usr/src/app

# Expose the port Cloud Run expects
EXPOSE 8080

# Copy the requirements file into the container
COPY requirements.txt ./

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the application code
COPY ./app /usr/src/app/app

# Original startup command, temporarily disabled for debugging
# CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8080"]

# --- TEMPORARY DEBUGGING COMMAND ---
# This command keeps the container alive so we can inspect its logs and file system.
CMD ["sh", "-c", "echo 'Container is in debug mode. Keeping alive with a sleep loop.' && while true; do sleep 3600; done"]