
import os
import sys
from dotenv import load_dotenv
from sqlalchemy import create_engine, text

# Load environment variables from .env file
load_dotenv(os.path.join(os.path.dirname(__file__), "../.env"))

def enable_vector_extension():
    db_url = os.getenv("DATABASE_URL")
    if not db_url:
        print("Error: DATABASE_URL not found in .env")
        sys.exit(1)
        
    print(f"Connecting to database...")
    engine = create_engine(db_url)
    
    try:
        with engine.connect() as connection:
            print("Enabling pgvector extension...")
            connection.execute(text("CREATE EXTENSION IF NOT EXISTS vector;"))
            connection.commit()
            print("Successfully enabled pgvector extension.")
    except Exception as e:
        print(f"Error enabling extension: {e}")
        sys.exit(1)

if __name__ == "__main__":
    enable_vector_extension()
