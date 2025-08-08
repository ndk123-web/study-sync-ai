from ..utils.ApiResponse import ApiResponse
from ..utils.ApiError import ApiError
from youtube_transcript_api import YouTubeTranscriptApi
from youtube_transcript_api.proxies import GenericProxyConfig
import requests

# Fetch free HTTPS proxies list from free-proxy-list.net
def fetch_free_https_proxies():
    url = "https://free-proxy-list.net/"
    resp = requests.get(url)
    lines = resp.text.splitlines()
    proxies = []
    for line in lines:
        if "<td>" in line:
            parts = line.strip().split("<td>")
            if len(parts) >= 7 and "yes" in parts[6]:  # HTTPS support
                ip = parts[1].split("</td>")[0]
                port = parts[2].split("</td>")[0]
                proxies.append(f"{ip}:{port}")
    return proxies

async def getTranscriptController(videoId: str):
    try:
        print("videoId", videoId)

        # Get proxies
        proxy_list = fetch_free_https_proxies()
        print(f"Fetched {len(proxy_list)} HTTPS proxies")

        fetched_transcript = None
        for proxy in proxy_list[:10]:  # Try top 10
            proxy_url = f"http://{proxy}"
            print(f"Trying proxy {proxy}")
            proxy_config = GenericProxyConfig(
                http_url=proxy_url,
                https_url=proxy_url
            )
            try:
                ytt_api = YouTubeTranscriptApi()
                fetched_transcript = ytt_api.fetch(videoId, languages=['en', 'hi', 'mar'])
                if fetched_transcript:
                    print(f"Success with proxy {proxy}")
                    break
            except Exception as e:
                print(f"Proxy {proxy} failed: {e}")
                continue

        if not fetched_transcript:
            # Fallback to direct fetch
            print("All proxies failed, trying direct fetch")
            ytt_api = YouTubeTranscriptApi()
            fetched_transcript = ytt_api.fetch(videoId, languages=['en', 'hi', 'mar'])

        transcript = []
        for snippet in fetched_transcript:
            transcript.append({
                "startTime": snippet['start'],
                "endTime": snippet['start'] + snippet['duration'],
                "text": snippet['text'].strip()
            })

        return ApiResponse.send(
            200,
            {"transcript": transcript},
            message="Transcript fetched successfully."
        )

    except Exception as e:
        print("Transcript fetch error:", str(e))
        return ApiError.send(
            500,
            {"error": str(e)},
            message="Failed to fetch transcript"
        )
