from app.controller.recommend_controller import get_recommendations
from fastapi import APIRouter
from app.middleware.verifyJWT import verifyJWT
from fastapi import Depends

recommendRouter = APIRouter()


@recommendRouter.get("/recommend-courses")
async def recommend_courses(userData=Depends(verifyJWT)):
    userId = userData.get("uid")
    print("User ID for recommendations: ", userId)
    recommendationsResponse = await get_recommendations(userId)
    return recommendationsResponse