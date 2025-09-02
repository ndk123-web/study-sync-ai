from app.middleware.verifyJWT import verifyJWT
from pydantic import BaseModel
from fastapi import Depends , Request , Query
from fastapi.routing import APIRouter
from ..controller.chat_controller import get_chat_response , ChatRequest, FetchChatsRequest, fetch_user_chat

chatRouter = APIRouter()

class ChatPostReqData(BaseModel):
    courseId: str
    prompt: str
    role : str

@chatRouter.post('/send-chat')
async def send_chat(payload: ChatPostReqData , userData = Depends(verifyJWT)):
    print("Course id for chat: ",payload.courseId)

    args = ChatRequest(courseId=payload.courseId, userData=userData, prompt=payload.prompt, role=payload.role)
    print("args: ",args)

    response = await get_chat_response(args)
    return response

@chatRouter.get('/fetch-chats')
async def fetch_chats(courseId=Query(...), role=Query(...), userData = Depends(verifyJWT)):
    args = FetchChatsRequest(courseId=courseId, userData=userData, role=role)
    response = await fetch_user_chat(args)  
    return response 