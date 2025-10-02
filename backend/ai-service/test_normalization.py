"""
Quick test to verify video link normalization and matching
"""
from urllib.parse import unquote

def normalize_video_link(video_link: str) -> str:
    """
    Normalize video link to handle URL encoding differences
    """
    if not video_link:
        return video_link
    
    # Try URL decoding in case it's still encoded
    try:
        decoded = unquote(video_link)
        # If decoding changed something, use decoded version
        if decoded != video_link:
            print(f"Decoded video link from\n  {video_link}\n  to\n  {decoded}")
            return decoded
    except Exception as e:
        print(f"Could not decode video link: {e}")
    
    return video_link

# Test cases from your logs
test_cases = [
    # Original (what should be in DB)
    "U2FsdGVkX1+XXxcv6zdYK8Rg/M77zu8rnB+4fbfaTK+X7UrNUZc+b8gLLY9ECP+H5Vvqn+mQbnibrNtCz1Mu1w==",
    
    # URL encoded (what might come from GET request)
    "U2FsdGVkX1%2BXXxcv6zdYK8Rg%2FM77zu8rnB%2B4fbfaTK%2BX7UrNUZc%2Bb8gLLY9ECP%2BH5Vvqn%2BmQbnibrNtCz1Mu1w%3D%3D",
]

print("Testing Video Link Normalization")
print("=" * 80)

for i, test_link in enumerate(test_cases, 1):
    print(f"\nTest Case {i}:")
    print(f"Input:  {test_link}")
    normalized = normalize_video_link(test_link)
    print(f"Output: {normalized}")
    print(f"Changed: {test_link != normalized}")

print("\n" + "=" * 80)
print("Comparison:")
norm1 = normalize_video_link(test_cases[0])
norm2 = normalize_video_link(test_cases[1])
print(f"Both normalize to same value: {norm1 == norm2}")
print(f"Normalized value: {norm1}")
