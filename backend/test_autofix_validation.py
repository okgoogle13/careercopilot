"""
Test file for auto-fix workflow validation (Python)
Contains intentional formatting issues that should be auto-fixed:
1. Black formatting issues (line length, spacing)
2. isort import organization issues
3. Unused imports
4. Unused variables
"""

# Unorganized imports
import os
import sys
from typing import Dict, List, Optional, Tuple, Any
import json
from datetime import datetime
import asyncio
from pathlib import Path
import re

# Unused imports - should be removed by autoflake
from collections import defaultdict, Counter, OrderedDict
import subprocess
import tempfile

# Black formatting issue: line too long
def process_user_data(user_id: str, user_name: str, user_email: str, user_phone: str, user_address: str, user_city: str, user_country: str):
    """Process user data with intentionally long line."""
    return {"id": user_id, "name": user_name, "email": user_email, "phone": user_phone, "address": user_address, "city": user_city, "country": user_country}


# Black formatting: inconsistent spacing
def calculate_total(items:List[Dict[str,Any]])->float:
    total=0.0
    for item in items:
        price=item.get("price",0.0)
        quantity=item.get("quantity",1)
        total+=price*quantity
    return total


# Unused variable - should be flagged
unused_constant = "This is never used"


class DataProcessor:
    """Test class with formatting issues."""

    def __init__(self,name:str,config:Dict[str,Any]):
        self.name=name
        self.config=config

    # Black: missing blank lines between methods
    def process(self,data:List[str])->List[str]:
        """Process data."""
        result=[]
        for item in data:
            if item:
                processed=item.strip().lower()
                result.append(processed)
        return result
    def validate(self,data:Dict[str,Any])->bool:
        """Validate data."""
        required_fields=["id","name","value"]
        return all(field in data for field in required_fields)


# Black: bad indentation in dict
config = {
"database": {
        "host": "localhost",
    "port": 5432,
        "name": "testdb"
    },
    "cache": {
    "enabled": True,
        "ttl": 3600
}
}


# isort: imports should be organized
from app.core.config import settings
from app.models.user import User
from app.services.auth import AuthService


# Unused function - won't be auto-removed but should be detected
def unused_helper_function(x: int, y: int) -> int:
    """This function is never called."""
    return x + y


async def fetch_data(url: str) -> Optional[Dict[str, Any]]:
    """Fetch data from URL."""
    # Black: inconsistent quotes
    headers = {'Content-Type': 'application/json', "User-Agent": "TestBot/1.0"}

    # Line too long
    response = await asyncio.get_event_loop().run_in_executor(None, lambda: json.loads('{"status": "success", "data": {"items": [1, 2, 3, 4, 5]}}'))

    return response


if __name__ == "__main__":
    # Black: missing spaces around operators
    result=calculate_total([{"price":10.0,"quantity":2},{"price":5.0,"quantity":3}])
    print(f"Total: {result}")
