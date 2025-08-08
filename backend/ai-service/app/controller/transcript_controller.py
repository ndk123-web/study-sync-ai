from ..utils.ApiResponse import ApiResponse
from ..utils.ApiError import ApiError
from youtube_transcript_api import YouTubeTranscriptApi
from youtube_transcript_api.proxies import GenericProxyConfig

async def getTranscriptController(videoId: str):
    try:
        print('videoId', videoId)

        # Proxy config (free proxy or your own proxy)
        proxy_config = GenericProxyConfig(
            http_url="http://123.141.181.53:5031",
            https_url="https://89.58.45.94:43476"
        )

        # Use proxy config with YouTubeTranscriptApi
        ytt_api = YouTubeTranscriptApi(proxy_config=proxy_config)

        # Fetch transcript in multiple languages (full transcript, no slicing)
        fetched_transcript = ytt_api.fetch(videoId, languages=['en', 'hi', 'mar'])

        transcript = []
        for snippet in fetched_transcript[:10]:
            transcript.append({
                "startTime": snippet['start'],
                "endTime": snippet['start'] + snippet['duration'],
                "text": snippet['text']
            })

        return ApiResponse.send(
            200,
            {"transcript": transcript},
            message="Transcript fetched successfully."
        )

    except Exception as e:
        print(str(e))
        return ApiError.send(
            500,
            {"error": str(e)},
            message="Failed to fetch transcript"
        )
