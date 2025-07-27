# api/utils/db.py

import os
from motor.motor_asyncio import AsyncIOMotorClient
from pymongo.server_api import ServerApi
from dotenv import load_dotenv

#  Make sure .env is loaded before accessing os.getenv
load_dotenv()

#  Use fallback or raise error if MONGO_DB_URI is missing
MONGO_URI = os.getenv("MONGO_DB_URI")
if not MONGO_URI:
    raise ValueError("❌ MONGO_DB_URI is not set in .env file or environment variables.")

#  Create MongoDB client once
client = AsyncIOMotorClient(MONGO_URI, server_api=ServerApi("1"))
db = client["study-sync"]

async def ping_server():
    try:
        db_instance = await client.admin.command('ping')
        print("✅ Pinged MongoDB. Connection OK:", db_instance)
        return True
    except Exception as e:
        print("❌ Error when pinging MongoDB:", str(e))
        return False