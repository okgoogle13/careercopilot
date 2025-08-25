from functools import lru_cache

from google.cloud import firestore


@lru_cache()
def get_db():
    return firestore.Client()
