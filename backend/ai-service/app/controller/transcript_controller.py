from ..utils.ApiResponse import ApiResponse

async def getTranscriptController(videoId: str): 
    return ApiResponse.send(200, {"transcript": f"This is a sample transcript for video ID: {videoId}."}, message="Transcript fetched successfully.")