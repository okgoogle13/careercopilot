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

# 6. The command to run the application. Uvicorn will listen on the port
#    provided by the Cloud Run environment ($PORT, which defaults to 8080).
CMD exec uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8080}
