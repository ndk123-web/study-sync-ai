# You'll need to import asyncio
import asyncio
from youtube_transcript_api import YouTubeTranscriptApi
from youtube_transcript_api._errors import (
    TranscriptsDisabled,
    NoTranscriptFound,
    VideoUnavailable,
)
from ..utils.ApiResponse import ApiResponse
from ..utils.ApiError import ApiError
from typing import Optional, List

async def getTranscriptController(videoId: str, languages: Optional[List[str]] = None):
    try:
        print("Fetching transcript for:", videoId)

        preferred = languages or ['en', 'hi', 'mar']

        # Use the same approach as your working script
        ytt_api = YouTubeTranscriptApi()
        raw_transcript = await asyncio.to_thread(
            ytt_api.fetch,  # The method to run
            videoId,        # Positional arguments for the method
            languages=preferred  # Keyword arguments for the method
        )

        # youtube_transcript_api returns a list of dicts: {"text", "start", "duration"}
        formatted_transcript = [
            {
                "startTime": float(snippet.get("start", 0)),
                "endTime": float(snippet.get("start", 0)) + float(snippet.get("duration", 0)),
                "text": (snippet.get("text") or "").strip(),
            }
            for snippet in raw_transcript
        ]

        # print("Fetched Transcript: ", formatted_transcript)

        return ApiResponse.send(
            200,
            {"transcript": formatted_transcript},
            message="Transcript fetched successfully."
        )

    except NoTranscriptFound as e:
        print("No transcript found:", str(e))
        return ApiError.send(404, {"error": "No transcript available for this video."}, message="Transcript not found")
    except TranscriptsDisabled as e:
        print("Transcripts disabled:", str(e))
        return ApiError.send(403, {"error": "Transcripts are disabled for this video."}, message="Access denied")
    except VideoUnavailable as e:
        print("Video unavailable:", str(e))
        return ApiError.send(404, {"error": "Video is unavailable or private."}, message="Video unavailable")
    except Exception as e:
        if '429' in str(e) or 'Too Many Requests' in str(e):
            print("Rate limited (in generic handler):", str(e))
            return ApiError.send(429, {"error": "Rate limit exceeded. Please try again later."}, message="Too many requests")
        print("Error fetching transcript:", str(e))
        return ApiError.send(
            500,
            {"error": str(e)},
            message="Failed to fetch transcript"
        )