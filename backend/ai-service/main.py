from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.db.db import ping_server
from contextlib import asynccontextmanager
import asyncio

from app.routes.transcript_router import transcriptRouter
from app.routes.summary_router import summaryRouter
from app.routes.chat_router import chatRouter

# from api.utils.addMiddlewares import setupMiddlewares
from app.config.firebase import initialize_firebase , check_firebase_connection
from dotenv import load_dotenv
import os

load_dotenv() 

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup logic
    connected = await ping_server()
    if connected:
        print("✅ Connected to MongoDB successfully!")
        await initialize_firebase()
    else:
        print("❌ MongoDB connection failed!")

    yield  # Application runs after this point

    # Shutdown logic
    print("🔻 App shutting down...")
    connected = await ping_server()
    if connected:
        print("✅ Connected to MongoDB successfully!")
        await initialize_firebase()
    else:
        print("❌ MongoDB connection failed!")

# Load environment variables

app = FastAPI(lifespan=lifespan)

# setup middlewares
app.add_middleware(
    CORSMiddleware,
    allow_origins=['http://localhost:5173','http://127.0.0.1:5173','http://192.168.0.103:5173'],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Setup DB CONNECTION

# For Test
@app.get("/")
async def read_root():
    print(os.getenv("BASE_PROMPT"))
    return {"Hello": "World"}

# Routes
app.include_router(transcriptRouter, prefix='/api/v1/transcripts')
app.include_router(summaryRouter, prefix='/api/v1/summaries')
app.include_router(chatRouter, prefix='/api/v1/chat')