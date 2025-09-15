from fastapi import APIRouter , Depends
from app.middleware.verifyJWT import verifyJWT
from pydantic import BaseModel, Field, validator
from ..controller.quiz_controller import complete_quiz_controller, generate_quiz_controller, complete_quiz_controller
from bson import ObjectId

quizRouter = APIRouter()

class QuizRequest(BaseModel):
    courseId: str
    level: str = "easy"  # default level

@quizRouter.post('/generate-quiz')
async def generate_quiz(payload: QuizRequest , userData = Depends(verifyJWT)):
    uid = userData.get('uid') or userData.get('user_id') or userData.get('sub')
    if not uid:
        return {"error": "Unauthorized: uid missing"}
    response = await generate_quiz_controller(payload.courseId, payload.level, uid)
    return response


class CompleteQuizRequest(BaseModel):
    quizId: str
    score: int 
    
@quizRouter.post('/complete-quiz')
async def complete_quiz(payload: CompleteQuizRequest , userData = Depends(verifyJWT)):
    uid = userData.get('uid') or userData.get('user_id') or userData.get('sub')
    if not uid:
        return {"error": "Unauthorized: uid missing"}
    
    print("Sending payload to complete_quiz_controller:", payload)
    response = await complete_quiz_controller(payload.quizId, payload.score, uid)
    print("Received response from complete_quiz_controller:", response)
    return response