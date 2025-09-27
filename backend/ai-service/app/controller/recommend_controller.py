import joblib
import numpy as np
import os
import tensorflow as tf
from app.db.db import db
from app.utils.ApiResponse import ApiResponse
from bson import ObjectId

# Collections
user_collection = db["users"]
quiz_collection = db["quizzes"]
enrollment_collection = db["enrollments"]
courses_collection = db["courses"]

# Load TensorFlow models once when module is imported
try:
    BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    
    # Load TensorFlow model
    tf_model = tf.keras.models.load_model(os.path.join(BASE_DIR, "tensorflow_recommendation_model.h5"))
    tf_mlb = joblib.load(os.path.join(BASE_DIR, "tensorflow_mlb_categories.joblib"))
    print("✅ TensorFlow models loaded successfully!")
    
    # Set as primary models
    model = tf_model
    mlb_model = tf_mlb
    MODEL_TYPE = "tensorflow"
    
except Exception as e:
    print(f"❌ Error loading TensorFlow models: {e}")
    # Fallback to scikit-learn models
    try:
        rf_model = joblib.load(os.path.join(BASE_DIR, "rf_category.joblib"))
        sk_mlb = joblib.load(os.path.join(BASE_DIR, "mlb_categories.joblib"))
        print("✅ Fallback: Scikit-learn models loaded successfully!")
        
        model = rf_model
        mlb_model = sk_mlb
        MODEL_TYPE = "sklearn"
    except Exception as e2:
        print(f"❌ Error loading fallback models: {e2}")
        model = None
        mlb_model = None
        MODEL_TYPE = None

# Master courses list (must match training data)
MASTER_COURSES = [
    "PYTHON2025ENG","GIT2025ENG","AIML2025ENG","UIUXHINDI","PYTHON2025HINDI",
    "FLUTTER2025EN","GIT2025HINDI","REACT2025HINDI","NODEJS2025HINDI",
    "PYTHONDATASCIENCE2025ENGLISH","DEVOPS2025HINDI"
]

# Course category mapping
COURSE_CATEGORY_MAP = {
    "PYTHON2025ENG": "PROGRAMMING",
    "GIT2025ENG": "GIT AND GITHUB", 
    "AIML2025ENG": "AI/ML",
    "UIUXHINDI": "DESIGN",
    "PYTHON2025HINDI": "PROGRAMMING",
    "FLUTTER2025EN": "MOBILE",
    "GIT2025HINDI": "GIT AND GITHUB",
    "REACT2025HINDI": "DEVELOPMENT", 
    "NODEJS2025HINDI": "DEVELOPMENT",
    "PYTHONDATASCIENCE2025ENGLISH": "DATA SCIENCE",
    "DEVOPS2025HINDI": "DEVOPS"
}

# Category to course mapping for recommendations
CATEGORY_TO_COURSES = {
    "PROGRAMMING": ["PYTHON2025ENG", "PYTHON2025HINDI"],
    "GIT AND GITHUB": ["GIT2025ENG", "GIT2025HINDI"],
    "AI/ML": ["AIML2025ENG", "PYTHONDATASCIENCE2025ENGLISH"],
    "DESIGN": ["UIUXHINDI"],
    "MOBILE": ["FLUTTER2025EN"],
    "DEVELOPMENT": ["REACT2025HINDI", "NODEJS2025HINDI"],
    "DATA SCIENCE": ["PYTHONDATASCIENCE2025ENGLISH", "AIML2025ENG"],
    "DEVOPS": ["DEVOPS2025HINDI"]
}

def encode_user_interactions(user_enrollments):
    """Convert user enrollments to feature vector for ML model"""
    NUM_FEATURES_PER_COURSE = 2  # progress, quiz_score
    INPUT_DIM = len(MASTER_COURSES) * NUM_FEATURES_PER_COURSE
    course_to_index = {c: i for i, c in enumerate(MASTER_COURSES)}
    
    vec = np.zeros(INPUT_DIM, dtype=np.float32)
    
    for enrollment in user_enrollments:
        course_id = enrollment.get("courseId", "")
        if course_id not in course_to_index:
            continue
            
        idx = course_to_index[course_id]
        base = idx * NUM_FEATURES_PER_COURSE
        
        # Progress (0-1)
        progress = enrollment.get("progress", 0) / 100.0 if enrollment.get("progress", 0) > 1 else enrollment.get("progress", 0)
        vec[base] = progress
        
        # Quiz score (0-1) - calculate average if multiple quizzes
        quiz_scores = enrollment.get("quizScores", [])
        if quiz_scores:
            avg_quiz_score = np.mean(quiz_scores) / 100.0 if np.mean(quiz_scores) > 1 else np.mean(quiz_scores)
            vec[base + 1] = avg_quiz_score
        else:
            vec[base + 1] = 0.0
    
    return vec.reshape(1, -1)

def predict_categories_tensorflow(feature_vector, threshold=0.3):
    """Make predictions using TensorFlow model"""
    try:
        # Get prediction probabilities
        predictions = model.predict(feature_vector, verbose=0)[0]
        
        # Apply threshold
        binary_predictions = (predictions >= threshold).astype(int).reshape(1, -1)
        predicted_categories = mlb_model.inverse_transform(binary_predictions)[0]
        
        return list(predicted_categories), predictions
    except Exception as e:
        print(f"Error in TensorFlow prediction: {e}")
        return [], np.array([])

def predict_categories_sklearn(feature_vector):
    """Make predictions using scikit-learn model"""
    try:
        predictions = model.predict(feature_vector)
        predicted_categories = mlb_model.inverse_transform(predictions)[0]
        
        # If no predictions, try with lower threshold using predict_proba
        if len(predicted_categories) == 0:
            try:
                prediction_probs = model.predict_proba(feature_vector)
                predictions_binary = np.zeros((1, len(mlb_model.classes_)))
                
                for i, class_probs in enumerate(prediction_probs):
                    if len(class_probs) > 1:
                        predictions_binary[0, i] = class_probs[1]
                
                # Use lower threshold for recommendations
                threshold = 0.2
                predictions_thresholded = (predictions_binary >= threshold).astype(int)
                predicted_categories = mlb_model.inverse_transform(predictions_thresholded)[0]
            except:
                predicted_categories = []
        
        return list(predicted_categories), np.array([])
    except Exception as e:
        print(f"Error in sklearn prediction: {e}")
        return [], np.array([])

async def get_course_details(course_ids):
    """Get course details from database"""
    try:
        cursor = courses_collection.find({"courseId": {"$in": course_ids}})
        courses = []
        async for course in cursor:
            course["_id"] = str(course["_id"])
            courses.append(course)
        return courses
    except Exception as e:
        print(f"Error fetching course details: {e}")
        return []

async def get_recommendations(userId: str):
    """Main recommendation function"""
    try:
        # Check if models are loaded
        if model is None or mlb_model is None:
            return ApiResponse.send(500, "ML models not available")
        
        # Find user
        user = await user_collection.find_one({"uid": userId})
        if not user:
            return ApiResponse.send(404, "User not found")
        
        # Get user enrollments
        user_enrollments_cursor = enrollment_collection.find({"userId": user["_id"]})
        user_enrollments = []
        async for enrollment in user_enrollments_cursor:
            user_enrollments.append(enrollment)
        
        if not user_enrollments:
            # New user - return popular courses from different categories
            default_recommendations = [
                "PYTHON2025ENG", "REACT2025HINDI", "GIT2025HINDI", 
                "DEVOPS2025HINDI", "PYTHONDATASCIENCE2025ENGLISH"
            ]
            course_details = await get_course_details(default_recommendations)
            return ApiResponse.send(200, "Default recommendations for new user", {
                "recommendations": course_details,
                "reason": "Popular courses for beginners"
            })
        
        # Encode user interactions for ML model
        feature_vector = encode_user_interactions(user_enrollments)
        
        # Get ML predictions based on model type
        if MODEL_TYPE == "tensorflow":
            predicted_categories, prediction_probs = predict_categories_tensorflow(feature_vector, threshold=0.3)
        elif MODEL_TYPE == "sklearn":
            predicted_categories, prediction_probs = predict_categories_sklearn(feature_vector)
        else:
            predicted_categories = []
            prediction_probs = np.array([])
        
        print(f"Predicted categories for user {userId}: {predicted_categories}")
        
        # Get enrolled course IDs to avoid recommending them again
        enrolled_course_ids = set(enrollment.get("courseId") for enrollment in user_enrollments)
        
        # Generate recommendations based on predicted categories
        recommended_courses = []
        for category in predicted_categories:
            if category in CATEGORY_TO_COURSES:
                for course_id in CATEGORY_TO_COURSES[category]:
                    if course_id not in enrolled_course_ids and course_id not in recommended_courses:
                        recommended_courses.append(course_id)
        
        # If no recommendations from ML, use intelligent fallback logic
        if not recommended_courses:
            # Analyze user's learning pattern and interests
            category_strength = {}
            course_performance = {}
            
            for enrollment in user_enrollments:
                course_id = enrollment.get("courseId", "")
                progress = enrollment.get("progress", 0)
                quiz_scores = enrollment.get("quizScores", [])
                avg_quiz = np.mean(quiz_scores) if quiz_scores else 0
                
                # Calculate overall performance score
                performance_score = (progress * 0.6) + (avg_quiz * 0.4)
                course_performance[course_id] = performance_score
                
                if course_id in COURSE_CATEGORY_MAP:
                    category = COURSE_CATEGORY_MAP[course_id]
                    if category not in category_strength:
                        category_strength[category] = []
                    category_strength[category].append(performance_score)
            
            # Get average performance per category
            for category in category_strength:
                category_strength[category] = np.mean(category_strength[category])
            
            # Smart recommendation logic
            if category_strength:
                # 1. Find user's strongest categories
                best_categories = sorted(category_strength.items(), key=lambda x: x[1], reverse=True)
                
                # 2. Recommend advanced courses in strong categories
                for category, strength in best_categories[:2]:
                    if strength > 60:  # Only if user is doing well
                        if category in CATEGORY_TO_COURSES:
                            for course_id in CATEGORY_TO_COURSES[category]:
                                if course_id not in enrolled_course_ids and course_id not in recommended_courses:
                                    recommended_courses.append(course_id)
                
                # 3. Recommend complementary skills
                complementary_map = {
                    "PROGRAMMING": ["GIT AND GITHUB", "DEVELOPMENT"],
                    "DEVELOPMENT": ["GIT AND GITHUB", "DEVOPS"],
                    "GIT AND GITHUB": ["DEVELOPMENT", "DEVOPS"],
                    "DATA SCIENCE": ["AI/ML", "PROGRAMMING"],
                    "AI/ML": ["DATA SCIENCE", "PROGRAMMING"],
                    "DESIGN": ["DEVELOPMENT", "MOBILE"],
                    "MOBILE": ["DEVELOPMENT", "DESIGN"],
                    "DEVOPS": ["GIT AND GITHUB", "DEVELOPMENT"]
                }
                
                for category, strength in best_categories[:1]:
                    if category in complementary_map:
                        for comp_category in complementary_map[category]:
                            if comp_category not in category_strength:  # User hasn't tried this category
                                if comp_category in CATEGORY_TO_COURSES:
                                    for course_id in CATEGORY_TO_COURSES[comp_category]:
                                        if course_id not in enrolled_course_ids and course_id not in recommended_courses:
                                            recommended_courses.append(course_id)
                                            break  # Only add one course per complementary category
                
                # 4. If still no recommendations, suggest popular progression paths
                if not recommended_courses:
                    progression_paths = [
                        ["PYTHON2025ENG", "PYTHONDATASCIENCE2025ENGLISH", "AIML2025ENG"],
                        ["GIT2025HINDI", "REACT2025HINDI", "NODEJS2025HINDI"],
                        ["PYTHON2025HINDI", "DEVOPS2025HINDI"],
                        ["UIUXHINDI", "FLUTTER2025EN"]
                    ]
                    
                    for path in progression_paths:
                        user_has_prerequisite = any(course in enrolled_course_ids for course in path[:-1])
                        if user_has_prerequisite:
                            next_course = path[-1]
                            if next_course not in enrolled_course_ids:
                                recommended_courses.append(next_course)
                                break
        
        # Limit to top 5 recommendations
        recommended_courses = recommended_courses[:5]
        
        # Get course details
        course_details = await get_course_details(recommended_courses)
        
        if not course_details:
            return ApiResponse.send(200, "No new recommendations available", {
                "recommendations": [],
                "reason": "User has enrolled in most relevant courses"
            })
        
        return ApiResponse.send(200, "Recommendations generated successfully", {
            "recommendations": course_details,
            "predicted_categories": list(predicted_categories) if predicted_categories else [],
            "total_enrollments": len(user_enrollments),
            "model_type": MODEL_TYPE,
            "prediction_probabilities": prediction_probs.tolist() if len(prediction_probs) > 0 else []
        })
        
    except Exception as e:
        print(f"Error in get_recommendations: {e}")
        return ApiResponse.send(500, f"Internal server error: {str(e)}")
    
    