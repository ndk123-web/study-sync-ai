"""
Debug script to check enrollment records and videoLink matching
"""
import asyncio
from app.db.db import db
from urllib.parse import unquote

enrollment_collection = db['enrollmentcourses']
user_collection = db['users']

async def check_enrollments():
    # Test user UID from logs
    test_uid = "AVGxnJqSfjYcUVPNk2YN09hXZSt2"
    
    # Test encrypted videoLink from logs
    test_video_link = "U2FsdGVkX1+XXxcv6zdYK8Rg/M77zu8rnB+4fbfaTK+X7UrNUZc+b8gLLY9ECP+H5Vvqn+mQbnibrNtCz1Mu1w=="
    
    print(f"Checking enrollments for UID: {test_uid}")
    print(f"Looking for videoLink: {test_video_link}")
    print("=" * 80)
    
    # Find user
    user = await user_collection.find_one({"uid": test_uid})
    if not user:
        print("❌ User not found!")
        return
    
    print(f"✅ User found: {user.get('email')}")
    print(f"   User _id: {user['_id']}")
    print()
    
    # Find all enrollments for this user
    all_enrollments = await enrollment_collection.find({"userId": user['_id']}).to_list(length=100)
    print(f"Total enrollments for user: {len(all_enrollments)}")
    print()
    
    # Filter video enrollments
    video_enrollments = [e for e in all_enrollments if e.get('type') == 'video']
    print(f"Video enrollments: {len(video_enrollments)}")
    print()
    
    if video_enrollments:
        print("Video Links in Database:")
        print("-" * 80)
        for i, enr in enumerate(video_enrollments, 1):
            video_link = enr.get('videoLink', 'N/A')
            print(f"{i}. {video_link}")
            print(f"   Title: {enr.get('videoTitle', 'N/A')}")
            print(f"   Creator: {enr.get('videoCreator', 'N/A')}")
            print(f"   Match: {video_link == test_video_link}")
            print()
    
    # Try exact match
    exact_match = await enrollment_collection.find_one({
        "userId": user['_id'],
        "videoLink": test_video_link
    })
    
    if exact_match:
        print("✅ EXACT MATCH FOUND!")
        print(f"   Enrollment ID: {exact_match['_id']}")
    else:
        print("❌ NO EXACT MATCH FOUND")
        print()
        print("Possible reasons:")
        print("1. The video was never enrolled (check if enrollment API was called)")
        print("2. The encrypted string differs slightly (encoding issue)")
        print("3. Different encryption key used")
    
    print()
    print("=" * 80)
    print("RECOMMENDATION:")
    print("If no match found, try enrolling the video first using the Load Video API")

if __name__ == "__main__":
    asyncio.run(check_enrollments())
