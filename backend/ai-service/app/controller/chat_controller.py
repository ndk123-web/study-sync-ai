from google import genai
from pydantic import BaseModel
from ..utils.ApiResponse import ApiResponse
from ..utils.ApiError import ApiError
import asyncio
from ..db.db import db  
from fastapi import Query
from urllib.parse import unquote
import re
from bson import ObjectId
import os

class ChatRequest(BaseModel):
    courseId: str
    userData: dict
    prompt: str
    role: str


# Collection References 
chat_collection = db['chats']
user_collection = db['users']
course_collection = db['courses']
enrollment_collection = db['enrollmentcourses']

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
            print(f"DEBUG: Decoded video link from {video_link} to {decoded}")
            return decoded
    except Exception as e:
        print(f"DEBUG: Could not decode video link: {e}")
    
    return video_link

async def auto_enroll_video(user_id, uid: str, video_link: str):
    """
    Auto-enroll user in a video if not already enrolled
    Returns the enrollment document
    """
    try:
        print(f"DEBUG auto_enroll: Creating enrollment for user {uid} with videoLink: {video_link}")
        
        # Check if already enrolled first
        existing = await enrollment_collection.find_one({
            "userId": user_id,
            "videoLink": video_link,
            "type": "video"
        })
        
        if existing:
            print("DEBUG auto_enroll: Enrollment already exists")
            return existing
        
        # Create new enrollment with minimal required fields
        new_enrollment = {
            "userId": user_id,
            "uid": uid,
            "type": "video",
            "videoLink": video_link,
            "videoTitle": "Video Chat Session",  # Placeholder, can be updated later
            "videoCreator": "Unknown",
            "videoDuration": "00:00:00"
        }
        
        result = await enrollment_collection.insert_one(new_enrollment)
        
        if result.inserted_id:
            new_enrollment["_id"] = result.inserted_id
            print(f"DEBUG auto_enroll: Created enrollment with ID: {result.inserted_id}")
            return new_enrollment
        else:
            print("DEBUG auto_enroll: Failed to create enrollment")
            return None
            
    except Exception as e:
        print(f"ERROR auto_enroll: {str(e)}")
        return None

async def find_enrollment_by_video(user_id, video_link: str):
    """
    Find enrollment by video link with multiple matching strategies
    """
    # Strategy 1: Exact match
    enrollment = await enrollment_collection.find_one({ 
        "userId": user_id, 
        "videoLink": video_link,
        "type": "video"
    })
    
    if enrollment:
        print("DEBUG: Found enrollment with exact match")
        return enrollment
    
    # Strategy 2: Try with normalized (decoded) link
    normalized_link = normalize_video_link(video_link)
    if normalized_link != video_link:
        enrollment = await enrollment_collection.find_one({ 
            "userId": user_id, 
            "videoLink": normalized_link,
            "type": "video"
        })
        if enrollment:
            print("DEBUG: Found enrollment with normalized match")
            return enrollment
    
    # Strategy 3: Check all video enrollments and compare (last resort)
    all_enrollments = await enrollment_collection.find({ 
        "userId": user_id,
        "type": "video"
    }).to_list(length=100)
    
    for enr in all_enrollments:
        stored_link = enr.get('videoLink', '')
        # Try comparing normalized versions
        if normalize_video_link(stored_link) == normalize_video_link(video_link):
            print("DEBUG: Found enrollment with fallback normalization match")
            return enr
    
    print(f"DEBUG: No enrollment found for video link: {video_link}")
    return None

async def get_chat_response( chatRequest: ChatRequest):

    # Use the actual user's prompt/question  
    user_message = chatRequest.prompt

    # For video chat: No system prompt, just direct user question
    # For course chat: Use system prompt with course context
    if chatRequest.role == "video":
        # Direct question-answer for videos, no system prompt
        previousChats = [
            {"role": "user", "content": user_message}
        ]
    else:
        # Course chat with full system prompt
        systemPrompt = f"""You are StudySync AI assistant. Help with course content, explain concepts, and guide learning about the courseId {chatRequest.courseId}.

Format responses with:
- **bold** for key terms
- ## for headings
- `code` for code
- - for lists

Keep responses clear and short, if the user asks other things instead of learning then kindly reply user
if user asks anything other than course related queries then politely refuse and say
"""
        previousChats = [
            {"role": "system", "content": systemPrompt},
            {"role": "user", "content": user_message}
        ]

    try:
        # Initialize Gemini client
        client = genai.Client(api_key=os.getenv('GEMINI_API_KEY'))
        
        # Format messages for Gemini API
        if chatRequest.role == "video":
            content = user_message
        else:
            # For course chat, combine system and user message
            systemPrompt = f"""You are StudySync AI assistant. Help with course content, explain concepts, and guide learning about the courseId {chatRequest.courseId}.

Format responses with:
- **bold** for key terms
- ## for headings
- `code` for code
- - for lists

Keep responses clear and short, if the user asks other things instead of learning then kindly reply user
if user asks anything other than course related queries then politely refuse and say"""
            content = f"{systemPrompt}\n\nUser Question: {user_message}"
        
        ai_response = await asyncio.to_thread(
            client.models.generate_content,
            model="gemini-2.0-flash-exp",
            contents=content
        )

        print("AI Response for chat: ", ai_response)
        
        # Extract text from Gemini response
        response_text = ai_response.text if hasattr(ai_response, 'text') else 'No response generated'

        print("uid: ", chatRequest.userData["uid"])
        print("courseId: ", chatRequest.courseId)

        userInstance = await user_collection.find_one({ "uid" : chatRequest.userData["uid"] })
        if not userInstance:
            return ApiError.send(400,{},message="User Not Found")

        if chatRequest.role == "course":
            courseInstance = await course_collection.find_one({ "courseId" : chatRequest.courseId })
            if not courseInstance:
                return ApiError.send(400,{},message="Course Not Found") 
        
        elif chatRequest.role == "video":
            # Debug: Check what video links exist for this user
            all_user_enrollments = await enrollment_collection.find({ "userId": userInstance['_id'], "type": "video" }).to_list(length=10)
            print(f"DEBUG: Found {len(all_user_enrollments)} video enrollments for user")
            for enr in all_user_enrollments:
                print(f"  - videoLink: {enr.get('videoLink')}")
            
            print(f"DEBUG: Searching for videoLink: {chatRequest.courseId}")
            
            # Use helper function for robust matching
            enrollment_collection_instance = await find_enrollment_by_video(userInstance['_id'], chatRequest.courseId)
            
            if not enrollment_collection_instance:
                # Auto-enroll the user if not enrolled
                print(f"DEBUG: No enrollment found, auto-enrolling user...")
                enrollment_collection_instance = await auto_enroll_video(
                    userInstance['_id'],
                    chatRequest.userData["uid"],
                    chatRequest.courseId
                )
                
                if not enrollment_collection_instance:
                    return ApiError.send(400, {}, message=f"Failed to create enrollment for this video. Please try again.")

        if chatRequest.role == "course":
        # Insert chat record into database
            chat_document = {
                "userId": userInstance['_id'],
                "courseId": courseInstance['_id'],
                "prompt": chatRequest.prompt,
                "response": response_text,
                "type": "course"
            }
            
            db_response = await chat_collection.insert_one(chat_document)
            
            if not db_response.inserted_id:
                return ApiError.send(400,{},message="Failed to save chat") 

            return ApiResponse.send(
                200,
                data={
                    "response": response_text,  # Only send the text content
                }
            )
        
        elif chatRequest.role == "video":
            chat_document = {
                "userId": userInstance['_id'],
                "enrollmentCourseId": enrollment_collection_instance['_id'],
                "prompt": chatRequest.prompt,
                "response": response_text,
                "type": "video"
            }
            db_response = await chat_collection.insert_one(chat_document)
            
            if not db_response.inserted_id:
                return ApiError.send(400,{},message="Failed to save chat")
            
            return ApiResponse.send(
                200,
                data={
                    "response": response_text,  # Only send the text content
                }
            )
        
    except Exception as e:
        print(f"Error in chat response: {str(e)}")
        return ApiError.send(
            500,
            data={},
            message=f"Failed to generate AI response: {str(e)}"
        )

class FetchChatsRequest(BaseModel):
    courseId: str 
    userData: dict
    role: str

async def fetch_user_chat( chatRequest: FetchChatsRequest ):
    userData = chatRequest.userData
    courseId = chatRequest.courseId
    
    print(f"DEBUG fetch_user_chat: courseId={courseId}, role={chatRequest.role}")
    
    userInstance = await user_collection.find_one({ "uid" : userData["uid"] })
    if not userInstance:
        return ApiError.send(400,{},message="User Not Found")

    if chatRequest.role == "course":
        courseInstance = await course_collection.find_one({ "courseId" : courseId })
        if not courseInstance:
            return ApiError.send(400,{},message="Course Not Found")

        # Fetch user chats from the database
        userChats = await chat_collection.find({ "userId": userInstance['_id'], "courseId": courseInstance['_id'] }).to_list(length=None)
        if not userChats or len(userChats) < 1:
            return ApiResponse.send(200 , data = {"chats": []} , message="No chats found for this course")

        # Convert ObjectId to string for JSON serialization
        formatted_chats = []
        for chat in userChats:
            # Add both user message and AI response as separate messages
            if chat.get("prompt"):
                user_message = {
                    "id": str(chat["_id"]) + "_user",
                    "type": "user", 
                    "message": chat["prompt"],
                    "timestamp": chat.get("_id").generation_time.isoformat() if chat.get("_id") else None,
                    "avatar": "👤"
                }
                formatted_chats.append(user_message)
            
            if chat.get("response"):
                ai_message = {
                    "id": str(chat["_id"]) + "_ai",
                    "type": "ai",
                    "message": chat["response"], 
                    "timestamp": chat.get("_id").generation_time.isoformat() if chat.get("_id") else None,
                    "avatar": "🤖"
                }
                formatted_chats.append(ai_message)

        return ApiResponse.send(
            200,
            data={
                "chats": formatted_chats
            }
        )
        
    elif chatRequest.role == "video":
        # Debug: Check what video links exist for this user
        all_user_enrollments = await enrollment_collection.find({ "userId": userInstance['_id'], "type": "video" }).to_list(length=10)
        print(f"DEBUG fetch: Found {len(all_user_enrollments)} video enrollments for user")
        for enr in all_user_enrollments:
            print(f"  - videoLink: {enr.get('videoLink')}")
        
        print(f"DEBUG fetch: Searching for videoLink: {courseId}")
        
        # Use helper function for robust matching
        enrollment_collection_instance = await find_enrollment_by_video(userInstance['_id'], courseId)
        
        if not enrollment_collection_instance:
            # Auto-enroll the user if not enrolled
            print(f"DEBUG fetch: No enrollment found, auto-enrolling user...")
            enrollment_collection_instance = await auto_enroll_video(
                userInstance['_id'],
                userData["uid"],
                courseId
            )
            
            if not enrollment_collection_instance:
                return ApiError.send(400, {}, message=f"Failed to create enrollment for this video. Please try again.")
        
        user_chats = await chat_collection.find({ "userId": userInstance['_id'], "enrollmentCourseId": enrollment_collection_instance['_id'] }).to_list(length=None)
        if not user_chats or len(user_chats) < 1:
            return ApiResponse.send(200 , data = {"chats": []} , message="No chats found for this video")
        
        formatted_chats = []
        for chat in user_chats:
            # Add both user message and AI response as separate messages
            if chat.get("prompt"):
                user_message = {
                    "id": str(chat["_id"]) + "_user",
                    "type": "user", 
                    "message": chat["prompt"],
                    "timestamp": chat.get("_id").generation_time.isoformat() if chat.get("_id") else None,
                    "avatar": "👤"
                }
                formatted_chats.append(user_message)
            
            if chat.get("response"):
                ai_message = {
                    "id": str(chat["_id"]) + "_ai",
                    "type": "ai",
                    "message": chat["response"], 
                    "timestamp": chat.get("_id").generation_time.isoformat() if chat.get("_id") else None,
                    "avatar": "🤖"
                }
                formatted_chats.append(ai_message)

        return ApiResponse.send(
            200,
            data={
                "chats": formatted_chats
            }
        )