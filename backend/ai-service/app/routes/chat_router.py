from app.middleware.verifyJWT import verifyJWT
from pydantic import BaseModel
from fastapi import Depends , Request , Query
from fastapi.routing import APIRouter
from ..controller.chat_controller import get_chat_response , ChatRequest

chatRouter = APIRouter()

class ChatPostReqData(BaseModel):
    courseId: str
    prompt: str

@chatRouter.post('/send-chat')
async def send_chat(payload: ChatPostReqData , userData = Depends(verifyJWT)):
    print("Course id for chat: ",payload.courseId)

    args = ChatRequest(courseId=payload.courseId, userData=userData, prompt=payload.prompt)
    print("args: ",args)

    response = await get_chat_response(args)
    return response