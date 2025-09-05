import asyncio
import json
import re
import ollama 
from app.db import db 
from pydantic import BaseModel
from bson import ObjectId
from ..utils.ApiResponse import ApiResponse
from ..utils.ApiError import ApiError
from youtube_transcript_api import YouTubeTranscriptApi
from youtube_transcript_api._errors import (
    TranscriptsDisabled,
    NoTranscriptFound,
    VideoUnavailable,
)
from .transcript_controller import getTranscriptController

class summaryRequest(BaseModel):
    course_id: str
    userData: dict
    videoId: str

async def get_summary_controller( payload: summaryRequest ):
    try:
        print("Receiver Payload : ", payload)
        courseId = payload.course_id
        videoId = payload.videoId
        userData = payload.userData

        print("Current VideoId in summary controller: ", videoId)

        preferred = ['en', 'hi', 'mar']

        # Use the same approach as your working transcript script
        ytt_api = YouTubeTranscriptApi()
        
        try:
            raw_transcript = await asyncio.to_thread(
                ytt_api.fetch,  # The method to run
                videoId,        # Positional arguments for the method
                languages=preferred  # Keyword arguments for the method
            )
        except NoTranscriptFound:
            return ApiError.send(
                404,
                {"error": "No transcript found"},
                message="No transcript available for this video"
            )
        except TranscriptsDisabled:
            return ApiError.send(
                403,
                {"error": "Transcripts disabled"},
                message="Transcripts are disabled for this video"
            )
        except VideoUnavailable:
            return ApiError.send(
                404,
                {"error": "Video unavailable"},
                message="The video is unavailable"
            )

        # Extract text from first 20 transcript snippets and join them
        context_texts = [snippet.text.strip() for snippet in raw_transcript[:20]]
        context = " ".join(context_texts)

        prompt_text = f"""Please provide a concise summary of the following video transcript content:

{context}

Summary should be:
- Clear and informative
- Focus on key points and main topics discussed"""

        # Run ollama.chat in a separate thread since it's blocking
        ai_response = await asyncio.to_thread(
            ollama.chat,
            model="mistral",
            messages=[
                {"role": "user", "content": prompt_text}
            ]
        )

        print("AI Response:", ai_response)

        # Extract the actual message content from ollama response
        summary_text = ai_response.get('message', {}).get('content', 'Summary generation failed')

        return ApiResponse.send(
            200,
            {"summary": summary_text},
            message="Summary generated successfully."
        )
    
    except Exception as e:
        print("Error generating summary:", str(e))
        return ApiError.send(
            500,
            {"error": str(e)},
            message="Failed to generate summary"
        )


class videoSummaryRequest(BaseModel):
    userData: dict
    videoId: str
    
def extract_video_id(url: str) -> str | None:
    """
    Extract YouTube videoId from different URL formats.
    Returns None if no match is found.
    """
    pattern = r"(?:v=|\/)([0-9A-Za-z_-]{11})(?:[?&].*)?$"
    match = re.search(pattern, url)
    return match.group(1) if match else None
    
async def get_video_summary_controller(payload: videoSummaryRequest):
    try:
        userData = payload.userData
        videoId = payload.videoId
        print("Current VideoId in video summary controller: ", videoId)
        
        proper_video_id = extract_video_id(videoId)
        
        if not proper_video_id:
            return ApiError.send(400, {"error": "Invalid YouTube URL"}, message="Could not extract video ID")
        
        response = await getTranscriptController(videoId=proper_video_id)
        data = json.loads(response.body.decode("utf-8"))
        
        prompt_text = f"""Please provide a concise summary of the following video transcript content:
         {data['data']['transcript'][:20]}
        Summary should be:
        - Clear and informative
        - Focus on key points and main topics discussed"""
        
        ai_response = await asyncio.to_thread(
            ollama.chat,
            model="mistral",
            messages=[
                {"role": "user", "content": prompt_text}
            ]
        )
        
        summary_text = ai_response.get('message', {}).get('content', 'Summary generation failed')
    
        return ApiResponse.send(
            200,
            {"summary": summary_text},
            message="Video summary fetched successfully."
        )
    
    except Exception as e:
        print("Error fetching video summary:", str(e))
        return ApiError.send(
            500,
            {"error": str(e)},
            message="Failed to fetch video summary"
        )  