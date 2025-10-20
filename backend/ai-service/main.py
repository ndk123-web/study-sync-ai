from fastapi import FastAPI , Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.db.db import ping_server
from contextlib import asynccontextmanager
import asyncio
import cloudinary
import joblib 

from app.routes.transcript_router import transcriptRouter
from app.routes.summary_router import summaryRouter
from app.routes.chat_router import chatRouter
from app.routes.pdf_router import pdfRouter
from app.routes.quiz_router import quizRouter
from app.routes.recommend_router import recommendRouter

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
        

cloudinary.config(
            cloud_name=os.environ.get('CLOUDINARY_CLOUD_NAME'),
            api_key=os.environ.get('CLOUDINARY_API_KEY'),
            api_secret=os.environ.get('CLOUDINARY_API_SECRET')
        )
print("Cloudinary Configured with env variables")

# Load environment variables

app = FastAPI(lifespan=lifespan)

# It will handle Preflight Request As well as Actual Request
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://study-sync-ai.vercel.app",
        "https://studysync.ndkdev.me"
    ],
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
app.include_router(pdfRouter, prefix='/api/v1/pdf')
app.include_router(quizRouter, prefix='/api/v1/quiz')
app.include_router(recommendRouter , prefix="/api/v1/recommend")