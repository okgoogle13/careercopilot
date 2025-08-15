# Use an official Python runtime as a parent image
FROM python:3.13-slim

# Set the working directory in the container
WORKDIR /usr/src/app

# Expose the port the app will run on
EXPOSE ${PORT:-8080}

# Copy the requirements file into the container at /usr/src/app
COPY requirements.txt ./

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the backend application code
COPY ./app /usr/src/app/app

# Original startup command, temporarily disabled for debugging
# CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8080"]

# --- TEMPORARY DEBUGGING COMMAND ---
# This command keeps the container alive so we can inspect its logs and file system.
CMD ["sh", "-c", "echo 'Container is in debug mode. Keeping alive with a sleep loop.' && while true; do sleep 3600; done"]
