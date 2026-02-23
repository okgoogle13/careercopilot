
import os
import sys
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv(os.path.join(os.path.dirname(__file__), "../.env"))

# Ensure backend directory is in python path
sys.path.append(os.path.join(os.path.dirname(__file__), "../backend"))

from app.core.database import db_config
from app.models.database import Base
# Import all models to ensure they are registered with Base.metadata
from app.models import user, profile, asset_library_schema, document_export_schemas, ingestion_schemas, master_profile_schema

def init_remote_db():
    print(f"Initializing database at: {db_config.database_url}")
    if "sqlite" in db_config.database_url:
        print("WARNING: Using SQLite. Ensure DATABASE_URL is set for remote Supabase initialization.")
    
    try:
        print("Creating tables...")
        Base.metadata.create_all(bind=db_config.engine)
        print("Tables created successfully.")
    except Exception as e:
        print(f"Error creating tables: {e}")
        sys.exit(1)

if __name__ == "__main__":
    init_remote_db()
