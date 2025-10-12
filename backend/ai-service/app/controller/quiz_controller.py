from datetime import datetime
import ollama
from ..db.db import db
import asyncio
from ..utils.ApiResponse import ApiResponse
from ..utils.ApiError import ApiError

quizzes_collection = db['quizzes']
courses_collection = db['courses']
users_collection = db['users']
activity_collection = db['activities']

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

        # Clean and parse JSON string -> Python list
        try:
            # Clean the AI response to fix common JSON issues
            cleaned_content = raw_content.strip()
            
            # Remove markdown code blocks if present
            if cleaned_content.startswith("```json"):
                cleaned_content = cleaned_content.replace("```json", "").replace("```", "")
            elif cleaned_content.startswith("```"):
                cleaned_content = cleaned_content.replace("```", "")
            
            # Remove any extra text before/after JSON
            cleaned_content = cleaned_content.strip()
            
            # Find the JSON array bounds
            start_idx = cleaned_content.find('[')
            end_idx = cleaned_content.rfind(']')
            
            if start_idx != -1 and end_idx != -1:
                cleaned_content = cleaned_content[start_idx:end_idx+1]
            
            print("Cleaned AI Response:", cleaned_content[:200] + "..." if len(cleaned_content) > 200 else cleaned_content)
            
            # json can convert any type of string and convert into any type of python variable
            # if the string = "123" -> it will convert to int 123
            # if the string = "[1,2,3]" -> it will convert to list [1,2,3]
            # if the string = '{"a":1}' -> it will convert to dict {"a":1}
            questions = json.loads(cleaned_content) # converting array of object to python list of dict 
            
            # Validate that we have a list with questions
            if not isinstance(questions, list) or len(questions) == 0:
                raise ValueError("AI response is not a valid question array")
                
            # Validate each question has required fields
            for i, q in enumerate(questions):
                if not isinstance(q, dict):
                    raise ValueError(f"Question {i+1} is not a valid object")
                if not all(key in q for key in ['question', 'options', 'answer']):
                    raise ValueError(f"Question {i+1} missing required fields")
                if not isinstance(q['options'], list) or len(q['options']) != 4:
                    raise ValueError(f"Question {i+1} options must be array of 4 items")
                    
        except (json.JSONDecodeError, ValueError) as e:
            print("❌ JSON parse/validation error:", str(e))
            print("❌ Raw AI Response:", raw_content)
            return ApiResponse.send(500, {"error": f"Invalid JSON from AI: {str(e)}"})
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
        
        # If score >= 70%, add +5 skill points to user
        user_instance = await users_collection.find_one({ "uid": userId })
        if not user_instance:
            return ApiResponse.send(404, {"error": "User not found"})
        
        if percentage_score >= 70:
            print("Current skill points:", user_instance.get('skillPoints', 0))
            new_skill_points = str(int((user_instance.get('skillPoints', 0) or 0) + 5))
            await users_collection.update_one(
                { "uid": userId },
                { "$set": { "skillPoints": new_skill_points } }
            )
            print(f"✅ Added 5 skill points to user {userId}. New skill points: {new_skill_points}")
        else:
            # add 3 skill points for attempting the quiz
            new_skill_points = str(int((user_instance.get('skillPoints', 0) or 0) + 3))
            await users_collection.update_one(
                { "uid": userId },
                { "$set": { "skillPoints": new_skill_points } }
            )
            print(f"✅ Added 3 skill points to user {userId}. New skill points: {new_skill_points}")
            print(f"ℹ️ No skill points added. User {userId} scored {percentage_score:.2f}%")
        
        course = None
        if quizInstance.get("courseId"):
            course = await courses_collection.find_one(
                { "_id": quizInstance.get("courseId") },
                { "title": 1 }
            )
        
        # New Activity: Quiz Completed
        await activity_collection.insert_one({
            "userId": user_instance.get('_id'),
            "type": "quiz-completed",
            "description": f"Completed quiz for courseId {course.get('title')} with score {percentage_score:.2f}%",
            "metadata": {
                "quizId": quizInstance.get('_id'),
                "score": f"{percentage_score:.2f}"
            },
            "createdAt": datetime.utcnow()
        })
        print("✅ Activity logged for quiz completion")
        
        return ApiResponse.send(200, {
            "message": "Quiz completed successfully", 
            "score": score,
            "totalQuestions": total_questions,
            "percentage": f"{percentage_score:.2f}%"
        })
    
    except Exception as e:
        print("❌ Error in complete_quiz_controller:", str(e))
        return ApiResponse.send(500, {"error": "Internal server error"})