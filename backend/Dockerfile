# 1. Use the official, required Python version
FROM python:3.11-slim

# 2. Set a consistent working directory
WORKDIR /app

# 3. Copy only the requirements file first to leverage Docker layer caching
COPY ./requirements.txt /app/requirements.txt

# 4. Install the dependencies
RUN pip install --no-cache-dir -r requirements.txt

# 5. Copy the entire application source code into the container
COPY ./app /app/app

# The command to run the application using Python's module syntax for reliability.
CMD ["python", "-m", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8080"]
