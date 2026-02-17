
import asyncio
import os
import sys
from flash_sidekick import consult_pro, _ensure_genai

async def main():
    query = sys.argv[1]
    context = sys.argv[2] if len(sys.argv) > 2 else None
    
    # Ensure environment variables are loaded
    from dotenv import load_dotenv
    load_dotenv(os.path.join(os.getcwd(), '.env'))
    
    result = await consult_pro(query, context)
    print(result)

if __name__ == "__main__":
    asyncio.run(main())
