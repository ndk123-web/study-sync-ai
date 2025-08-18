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

    systemPrompt = f"""You are an AI assistant for StudySync AI, an educational platform that helps students learn from video courses. 

Your role is to:
- Answer questions about the course content
- Help explain concepts from the lessons
- Provide additional examples and clarifications
- Guide students through learning difficulties
- Be encouraging and supportive

IMPORTANT FORMATTING GUIDELINES:
- Use **bold** for important terms and concepts
- Use *italic* for emphasis
- Use ## for main headings and ### for subheadings
- Use bullet points (-) for lists
- Use numbered lists (1., 2., 3.) for steps
- Use `code` for inline code snippets
- Use ```language for code blocks (specify language like python, javascript, java, etc.)
- Use > for important quotes or key takeaways
- Keep responses concise but comprehensive
- Format like ChatGPT with proper markdown structure

Example response format:
## Main Topic

**Key Concept**: Explanation here

### Important Points:
- Point 1 with **emphasis**
- Point 2 with `inline code`
- Point 3

```python
# Code example
def example():
    return "formatted code"
```

> **Key Takeaway**: Important summary

Always respond in a helpful, clear, and educational manner with proper markdown formatting."""

    # Use the actual user's prompt/question
    user_message = f"Course ID: {chatRequest.courseId}\n\nStudent Question: {chatRequest.prompt}"

    # Previous chats will come from a database for context 
    previousChats = [
        {"role": "system", "content": systemPrompt},
        {"role": "user", "content": user_message}
    ]

    ai_response = await asyncio.to_thread(
            ollama.chat,
            model="mistral",
            messages=previousChats
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