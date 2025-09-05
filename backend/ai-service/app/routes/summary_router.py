from fastapi.routing import APIRouter
from app.controller.summary_controller import get_summary_controller, summaryRequest , videoSummaryRequest, get_video_summary_controller
from fastapi import Depends , Request , Query
from app.middleware.verifyJWT import verifyJWT
from pydantic import BaseModel

class GetSummaryData(BaseModel):
    courseId: str
    videoId: str

summaryRouter = APIRouter()

@summaryRouter.post('/get-summary')
async def get_summary(summaryData: GetSummaryData, userData = Depends(verifyJWT)):
    print("Current User: ", userData)
    print("Course ID: ", summaryData.courseId)
    print("Video ID: ", summaryData.videoId)
    # Build payload using Pydantic model instead of dictionary
    
    payload = summaryRequest(
        course_id=summaryData.courseId,
        userData=userData,
        videoId=summaryData.videoId
    )
    
    summary = await get_summary_controller(payload)
    return summary


class GetVideoSummaryData(BaseModel):
    videoId: str

@summaryRouter.post('/get-video-summary')
async def get_video_summary(video_summary_data: GetVideoSummaryData, userData = Depends(verifyJWT)):
    print("Current User: ", userData)
    print("Video ID: ", video_summary_data.videoId)
    
    payload = videoSummaryRequest(
        userData=userData,
        videoId=video_summary_data.videoId
    )
    
    summary = await get_video_summary_controller(payload)
    return summary