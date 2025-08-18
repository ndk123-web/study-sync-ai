import ollama 
from pydantic import BaseModel
from ..utils.ApiResponse import ApiResponse
from ..utils.ApiError import ApiError
import asyncio

class ChatRequest(BaseModel):
    courseId: str
    userData: dict
    prompt: str

async def get_chat_response( chatRequest: ChatRequest):

    systemPrompt = f"""You are StudySync AI assistant. Help with course content, explain concepts, and guide learning.

Format responses with:
- **bold** for key terms
- ## for headings
- `code` for code
- - for lists

Keep responses clear if the user asks other things instead of learning then kindly reply user"""

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

        return ApiResponse.send(
            200,
            data={
                "response": response_text,  # Only send the text content
                "courseId": chatRequest.courseId,
                "userData": chatRequest.userData  
            }
        )
    except Exception as e:
        print(f"Error in chat response: {str(e)}")
        return ApiError.send(
            500,
            message="Failed to generate AI response",
            error=str(e)
        )