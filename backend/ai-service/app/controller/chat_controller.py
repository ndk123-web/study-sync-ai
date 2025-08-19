import ollama 
from pydantic import BaseModel
from ..utils.ApiResponse import ApiResponse
from ..utils.ApiError import ApiError
import asyncio
from ..db.db import db  
from fastapi import Query

class ChatRequest(BaseModel):
    courseId: str
    userData: dict
    prompt: str


# Collection References 
chat_collection = db['chats']
user_collection = db['users']
course_collection = db['courses']

async def get_chat_response( chatRequest: ChatRequest):

    systemPrompt = f"""You are StudySync AI assistant. Help with course content, explain concepts, and guide learning.

Format responses with:
- **bold** for key terms
- ## for headings
- `code` for code
- - for lists

Keep responses clear and short, if the user asks other things instead of learning then kindly reply user"""

    # Use the actual user's prompt/question  
    user_message = chatRequest.prompt

    # Previous chats will come from a database for context 
    previousChats = [
        {"role": "system", "content": systemPrompt},
        {"role": "user", "content": user_message}
    ]

    try:
        ai_response = await asyncio.to_thread(
                ollama.chat,
                model="mistral",
                messages=previousChats,
                options={
                    "temperature": 0.7,
                    "top_p": 0.9,
                    "num_predict": 512  # Limit response length for faster processing
                }
            )

        print("AI Response for chat: ", ai_response)
        
        # Extract only the message content from the Ollama response
        response_text = ai_response.get('message', {}).get('content', 'No response generated')

        print("uid: ", chatRequest.userData["uid"])
        print("courseId: ", chatRequest.courseId)

        userInstance = await user_collection.find_one({ "uid" : chatRequest.userData["uid"] })
        if not userInstance:
            return ApiError.send(400,{},message="User Not Found")

        courseInstance = await course_collection.find_one({ "courseId" : chatRequest.courseId })
        if not courseInstance:
            return ApiError.send(400,{},message="Course Not Found") 

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

async def fetch_user_chat( chatRequest: FetchChatsRequest ):
    userData = chatRequest.userData
    courseId = chatRequest.courseId
    
    userInstance = await user_collection.find_one({ "uid" : userData["uid"] })
    if not userInstance:
        return ApiError.send(400,{},message="User Not Found")

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