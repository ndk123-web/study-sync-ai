from fastapi.routing import APIRouter
from app.controller.summary_controller import get_summary_controller
from fastapi import Depends , Request , Query
from app.middleware.verifyJWT import verifyJWT

summaryRouter = APIRouter()

@summaryRouter.post('/get-summary')
async def get_summary(userData = Depends(verifyJWT) , courseId: str = Query(...) ):
    print("Current User: ", userData)
    print("Course ID: ", courseId)
    summary = await get_summary_controller( { userData: userData , courseId: courseId  }  )
    return summary 