
import os
<<<<<<< HEAD
from supabase import create_client, Client
from functools import lru_cache

@lru_cache()
def get_supabase_client() -> Client:
    url: str = os.environ.get("SUPABASE_URL", "")
    key: str = os.environ.get("SUPABASE_SERVICE_ROLE_KEY") or os.environ.get("SUPABASE_ANON_KEY", "")
    
    if not url or not key:
        raise ValueError("SUPABASE_URL and SUPABASE_KEY must be set")
        
=======
from functools import lru_cache

from supabase import Client, create_client


@lru_cache
def get_supabase_client() -> Client:
    url: str = os.environ.get("SUPABASE_URL", "")
    key: str = os.environ.get("SUPABASE_SERVICE_ROLE_KEY") or os.environ.get("SUPABASE_ANON_KEY", "")

    if not url or not key:
        raise ValueError("SUPABASE_URL and SUPABASE_KEY must be set")

>>>>>>> restoration-KR-Rage-Figma-v2.0
    return create_client(url, key)

def get_supabase_storage():
    client = get_supabase_client()
    return client.storage
