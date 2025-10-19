from fastapi import FastAPI, Request, Response
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

# setup middlewares
# Build allowed origins from env or fallback to common dev + prod origins
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS")
if ALLOWED_ORIGINS:
    allowed_origins = [o.strip() for o in ALLOWED_ORIGINS.split(",") if o.strip()]
else:
    allowed_origins = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://192.168.0.103:5173",
        "https://study-sync-ai.vercel.app",
        "https://studysync.ndkdev.me"
    ]

# Add FastAPI's CORSMiddleware to handle most CORS behavior
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.middleware("http")
async def cors_preflight_middleware(request: Request, call_next):
    """Explicit preflight handling + response header reflection.
    - If OPTIONS and origin allowed -> return 204 with CORS headers
    - Otherwise proceed and attach CORS headers on the response when origin allowed
    This complements CORSMiddleware and gives debug visibility.
    """
    origin = request.headers.get("origin")
    debug = os.getenv("CORS_DEBUG") == "true"

    if debug:
        print("[CORS] incoming request", {"method": request.method, "origin": origin, "path": request.url.path})

    # Preflight
    if request.method == "OPTIONS":
        if origin and origin in allowed_origins:
            headers = {
                "Access-Control-Allow-Origin": origin,
                "Access-Control-Allow-Credentials": "true",
                "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
                "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept, Authorization",
            }
            if debug:
                print("[CORS] preflight accepted for", origin, "path", request.url.path)
            return Response(status_code=204, headers=headers)
        else:
            if debug:
                print("[CORS] preflight rejected for", origin, "path", request.url.path)
            return JSONResponse({"success": False, "message": "CORS origin not allowed"}, status_code=403)

    # For non-preflight requests, wrap to catch exceptions and ensure CORS headers always present
    try:
        response = await call_next(request)
    except Exception as e:
        # If an unhandled exception occurs, return 500 with CORS headers
        print(f"[CORS Middleware] Caught unhandled exception: {str(e)}")
        response = JSONResponse({"error": "Internal Server Error"}, status_code=500)
    
    # ALWAYS add CORS headers to the response (even on errors)
    if origin and origin in allowed_origins:
        response.headers["Access-Control-Allow-Origin"] = origin
        response.headers["Access-Control-Allow-Credentials"] = "true"
        if debug:
            print(f"[CORS] Added headers to response for origin: {origin}")
    
    return response

# Setup DB CONNECTION

# Global exception handler to ensure all errors return with proper formatting
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Catch any unhandled exceptions and return JSON error with CORS headers."""
    print(f"[ERROR] Unhandled exception: {str(exc)}")
    import traceback
    traceback.print_exc()
    
    origin = request.headers.get("origin")
    debug = os.getenv("CORS_DEBUG") == "true"
    
    response = JSONResponse(
        {"success": False, "error": str(exc), "message": "Internal Server Error"},
        status_code=500
    )
    
    # Add CORS headers to error response
    if origin and origin in allowed_origins:
        response.headers["Access-Control-Allow-Origin"] = origin
        response.headers["Access-Control-Allow-Credentials"] = "true"
        if debug:
            print(f"[CORS] Added error response headers for origin: {origin}")
    
    return response

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
