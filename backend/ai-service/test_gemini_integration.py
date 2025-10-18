#!/usr/bin/env python3
"""
Test script to verify Gemini API integration is working
"""
import asyncio
import os
from dotenv import load_dotenv
from google import genai

# Load environment variables
load_dotenv()

async def test_gemini_api():
    """Test basic Gemini API functionality"""
    try:
        # Get API key from environment
        api_key = os.getenv('GEMINI_API_KEY')
        if not api_key:
            print("❌ GEMINI_API_KEY not found in environment variables")
            return False
            
        print(f"✅ Found GEMINI_API_KEY: {api_key[:10]}...")
        
        # Initialize client
        client = genai.Client(api_key=api_key)
        print("✅ Successfully initialized Gemini client")
        
        # Test simple content generation
        test_prompt = "Explain artificial intelligence in one sentence."
        
        response = await asyncio.to_thread(
            client.models.generate_content,
            model="gemini-2.0-flash-exp",
            contents=test_prompt
        )
        
        print("✅ Successfully generated content:")
        print(f"Response: {response.text}")
        
        return True
        
    except Exception as e:
        print(f"❌ Error testing Gemini API: {str(e)}")
        return False

async def test_chat_controller_format():
    """Test the chat controller format we'll be using"""
    try:
        api_key = os.getenv('GEMINI_API_KEY')
        client = genai.Client(api_key=api_key)
        
        # Test course chat format
        system_prompt = """You are StudySync AI assistant. Help with course content, explain concepts, and guide learning about Python Programming.

Format responses with:
- **bold** for key terms
- ## for headings
- `code` for code
- - for lists

Keep responses clear and short, if the user asks other things instead of learning then kindly reply user
if user asks anything other than course related queries then politely refuse and say"""
        
        user_question = "What are Python data types?"
        content = f"{system_prompt}\n\nUser Question: {user_question}"
        
        response = await asyncio.to_thread(
            client.models.generate_content,
            model="gemini-2.0-flash-exp",
            contents=content
        )
        
        print("✅ Course chat format test successful:")
        print(f"Response: {response.text[:200]}...")
        
        return True
        
    except Exception as e:
        print(f"❌ Error testing chat controller format: {str(e)}")
        return False

async def main():
    print("🧪 Testing Gemini API Integration...")
    print("="*50)
    
    # Test basic API functionality
    basic_test = await test_gemini_api()
    print("-"*50)
    
    # Test chat controller format
    chat_test = await test_chat_controller_format()
    print("-"*50)
    
    if basic_test and chat_test:
        print("🎉 All tests passed! Gemini API integration is working correctly.")
    else:
        print("❌ Some tests failed. Please check the error messages above.")

if __name__ == "__main__":
    asyncio.run(main())