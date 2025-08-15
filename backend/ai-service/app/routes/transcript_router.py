from fastapi import APIRouter, Depends 
from pydantic import BaseModel
from ..controller.transcript_controller import getTranscriptController
from ..middleware.verifyJWT import verifyJWT

transcriptRouter = APIRouter()

class transcriptBody(BaseModel): 
    videoId: str
    languages: list[str] | None = None  

@transcriptRouter.post("/get-transcript")
async def get_transcript(payload: transcriptBody , userData = Depends(verifyJWT)):
    print("Payload: ",payload)
    print("User Data: Verified!!")  
    response =  await getTranscriptController(payload.videoId, payload.languages)
    return response 