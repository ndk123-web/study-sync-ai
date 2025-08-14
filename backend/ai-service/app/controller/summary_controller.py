import ollama 
from app.db import db 
from pydantic import BaseModel
from bson import ObjectId

class summaryRequest(BaseModel):
    course_id: str
    userData: dict

async def get_summary_controller( payload: summaryRequest ):
    
    print("Receiver Payload : ", payload)
    
    courses_collection = db['courses']
    enrolled_collection = db['enrollmentcourses']
    
    return {
        "summary": "Sample Summary"
    }
