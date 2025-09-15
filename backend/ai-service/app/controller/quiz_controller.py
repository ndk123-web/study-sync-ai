import ollama
from ..db.db import db
import asyncio
from ..utils.ApiResponse import ApiResponse
from ..utils.ApiError import ApiError

quizzes_collection = db['quizzes']
courses_collection = db['courses']
users_collection = db['users']

import json
import ollama
from ..db.db import db
import asyncio
from ..utils.ApiResponse import ApiResponse
from ..utils.ApiError import ApiError
import json
from bson import ObjectId , json_util

quizzes_collection = db['quizzes']
courses_collection = db['courses']
users_collection = db['users']

def serialize_doc(doc):
    return json.loads(json_util.dumps(doc))

async def generate_quiz_controller(courseId: str , level: str, uid: str):
    try:
        userInstance = await users_collection.find_one({"uid": uid})
        if not userInstance:
            return ApiResponse.send(404, {"error": "User not found"})
        
        courseInstance = await courses_collection.find_one({ "courseId": courseId })
        if not courseInstance:
            return ApiResponse.send(404, {"error": "Course not found"})
        
        prompt = f"""
        You are StudySync assistance. Give me ONLY a raw JSON array of exactly 7 quiz questions for topic "{courseId}" at {level} level. 
        Each object must have: "question", "options" (array of 4 strings), and "answer" (string with correct option).
        Do not include markdown, code fences, explanation, or any extra text — only the JSON array itself.
        """
        
        print("AI Prompt:", prompt)
        
        ai_response = await asyncio.to_thread(
            ollama.chat,
            model="mistral",
            messages=[
                {"role": "user", "content": prompt}
            ]
        )

        # Extract raw content string
        raw_content = ai_response["message"]["content"]
        print("AI Raw Response:", raw_content)

        # Parse JSON string -> Python list
        try:
            # json can convert any type of string and convert into any type of python variable
            # if the string = "123" -> it will convert to int 123
            # if the string = "[1,2,3]" -> it will convert to list [1,2,3]
            # if the string = '{"a":1}' -> it will convert to dict {"a":1}
            questions = json.loads(raw_content) # converting array of object to python list of dict 
        except json.JSONDecodeError as e:
            print("❌ JSON parse error:", str(e))
            return ApiResponse.send(500, {"error": "Invalid JSON from AI"})
        quizInstance = await quizzes_collection.insert_one({
            "courseId": courseInstance.get('_id'),
            "userId": userInstance.get('_id'),
            "level": level,
            "questions": questions,
            "completed": False,
            "score": "0"
        })

        # Ab naya inserted document fetch kar le
        inserted_id = quizInstance.inserted_id
        newQuizDoc = await quizzes_collection.find_one({"_id": inserted_id})

        sendQuizResponse = serialize_doc(newQuizDoc)

        return ApiResponse.send(200, {"questions": sendQuizResponse , "id" : str(inserted_id)})
    
    except Exception as e:
        print("❌ Error in generate_quiz_controller:", str(e))
        return ApiResponse.send(500, {"error": "Internal server error"})

async def complete_quiz_controller(quizId: str, score: int, userId):
    try:
        print(f"🔍 Attempting to complete quiz - QuizId: {quizId}, Score: {score}, UserId: {userId}")
        print(f"🔍 Data types - QuizId type: {type(quizId)}, Score type: {type(score)}")
        print(f"🔍 QuizId length: {len(quizId) if quizId else 'None'}")
        
        # Validate ObjectId format
        try:
            quiz_object_id = ObjectId(quizId)
            print(f"✅ Successfully converted to ObjectId: {quiz_object_id}")
        except Exception as e:
            print(f"❌ Invalid ObjectId format: {quizId}, Error: {str(e)}")
            return ApiResponse.send(400, {"error": f"Invalid quiz ID format: {str(e)}"})
        
        quizInstance = await quizzes_collection.find_one({ "_id": quiz_object_id })
        if not quizInstance:
            print(f"❌ Quiz not found with ID: {quizId}")
            return ApiResponse.send(404, {"error": "Quiz not found"})

        print("✅ Quiz found:", quizInstance.get('_id'))
        
        # Get total questions from the quiz
        total_questions = len(quizInstance.get('questions', []))
        if total_questions == 0:
            return ApiResponse.send(500, {"error": "No questions found in quiz"})
            
        # Calculate percentage based on actual total questions
        percentage_score = (score / total_questions) * 100
        
        update_result = await quizzes_collection.update_one(
            { "_id": quiz_object_id },
            { "$set": { "completed": True, "score": f"{percentage_score:.2f}" } }
        )
        if update_result.modified_count == 0:
            return ApiResponse.send(500, {"error": "Failed to update quiz status"})
        print("Quiz updated:", update_result.modified_count)
        return ApiResponse.send(200, {
            "message": "Quiz completed successfully", 
            "score": score,
            "totalQuestions": total_questions,
            "percentage": f"{percentage_score:.2f}%"
        })
    
    except Exception as e:
        print("❌ Error in complete_quiz_controller:", str(e))
        return ApiResponse.send(500, {"error": "Internal server error"})