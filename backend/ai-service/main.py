from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.db.db import ping_server
# from api.utils.addMiddlewares import setupMiddlewares
from app.config.firebase import initialize_firebase , check_firebase_connection
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

app = FastAPI()

# setup middlewares
app.add_middleware(
    CORSMiddleware,
    allow_origins=['http://localhost:5173','http://127.0.0.1:5173','http://192.168.0.103:5173'],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Setup DB CONNECTION
@app.on_event("startup")
async def startup_event():
    connected = await ping_server()
    if connected:
        print("✅ Connected to MongoDB successfully!")
        await initialize_firebase()
    else:
        print("❌ MongoDB connection failed!")


# For Test
@app.get("/")
async def read_root():
    print(os.getenv("BASE_PROMPT"))
    return {"Hello": "World"}

# Routes
# app.include_router(resume_router, prefix="/api/v1/resumes")