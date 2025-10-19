import joblib
import numpy as np
import os
from datetime import datetime
from app.db.db import db
from app.utils.ApiResponse import ApiResponse
from bson import ObjectId

# Collections
user_collection = db["users"]
quiz_collection = db["quizzes"]
enrollment_collection = db["enrollmentcourses"]
courses_collection = db["courses"]

# Load models (prefer TensorFlow if available, otherwise fallback to scikit-learn)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
model = None
mlb_model = None
MODEL_TYPE = None

try:
    # Try to import TensorFlow and load TF models. If TensorFlow isn't installed
    # or model loading fails, fall through to the scikit-learn fallback below.
    try:
        import tensorflow as tf

        tf_model = tf.keras.models.load_model(os.path.join(BASE_DIR, "tensorflow_recommendation_model.h5"))
        tf_mlb = joblib.load(os.path.join(BASE_DIR, "tensorflow_mlb_categories.joblib"))
        print("✅ TensorFlow models loaded successfully!")

        model = tf_model
        mlb_model = tf_mlb
        MODEL_TYPE = "tensorflow"

    except Exception as tf_err:
        # TensorFlow not available or model load failed — log and attempt sklearn fallback
        print(f"❌ TensorFlow unavailable or failed to load: {tf_err}")
        # Fallback to scikit-learn models
        rf_model = joblib.load(os.path.join(BASE_DIR, "rf_category.joblib"))
        sk_mlb = joblib.load(os.path.join(BASE_DIR, "mlb_categories.joblib"))
        print("✅ Fallback: Scikit-learn models loaded successfully!")

        model = rf_model
        mlb_model = sk_mlb
        MODEL_TYPE = "sklearn"

except Exception as e:
    # Any unexpected error loading models
    print(f"❌ Error loading ML models: {e}")
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

async def map_objectid_to_courseid(course_object_ids):
    """Map MongoDB ObjectIds to course codes (courseId field)"""
    try:
        object_ids = [ObjectId(str(obj_id)) for obj_id in course_object_ids if obj_id]
        cursor = courses_collection.find({"_id": {"$in": object_ids}}, {"_id": 1, "courseId": 1})
        
        object_id_to_course_code = {}
        async for course in cursor:
            object_id_to_course_code[str(course["_id"])] = course.get("courseId", "")
        
        print(f"🗺️ DEBUG: ObjectId to CourseId mapping: {object_id_to_course_code}")
        return object_id_to_course_code
    except Exception as e:
        print(f"❌ ERROR mapping ObjectIds to courseIds: {e}")
        return {}

def encode_user_interactions(user_enrollments, object_id_to_course_code=None):
    """Convert user enrollments to feature vector for ML model"""
    NUM_FEATURES_PER_COURSE = 2  # progress, quiz_score
    INPUT_DIM = len(MASTER_COURSES) * NUM_FEATURES_PER_COURSE
    course_to_index = {c: i for i, c in enumerate(MASTER_COURSES)}
    
    vec = np.zeros(INPUT_DIM, dtype=np.float32)
    
    print(f"🔍 DEBUG: Processing {len(user_enrollments)} enrollments for ML model")
    
    for enrollment in user_enrollments:
        enrollment_course_id = enrollment.get("courseId", "")
        
        # Map ObjectId to course code if mapping is provided
        if object_id_to_course_code and str(enrollment_course_id) in object_id_to_course_code:
            course_id = object_id_to_course_code[str(enrollment_course_id)]
            print(f"📝 DEBUG: Mapped {enrollment_course_id} -> {course_id}")
        else:
            course_id = str(enrollment_course_id)
            print(f"⚠️ DEBUG: No mapping found for {enrollment_course_id}, using as-is")
        
        # Check if course is in our master list
        if course_id not in course_to_index:
            print(f"❌ DEBUG: Course {course_id} not in MASTER_COURSES list, skipping")
            continue
            
        idx = course_to_index[course_id]
        base = idx * NUM_FEATURES_PER_COURSE
        
        # Progress (0-1)
        progress_raw = enrollment.get("progress", 0)
        progress = float(progress_raw) / 100.0 if float(progress_raw) > 1 else float(progress_raw)
        vec[base] = progress
        
        # Quiz score (0-1) - calculate average if multiple quizzes
        quiz_scores = enrollment.get("quizScores", [])
        if quiz_scores:
            avg_quiz_score = np.mean(quiz_scores) / 100.0 if np.mean(quiz_scores) > 1 else np.mean(quiz_scores)
            vec[base + 1] = avg_quiz_score
        else:
            vec[base + 1] = 0.0  # No quiz data available
        
        print(f"✅ DEBUG: {course_id} -> progress: {progress:.2f}, quiz: {vec[base + 1]:.2f}")
    
    print(f"🎯 DEBUG: Feature vector shape: {vec.shape}, non-zero elements: {np.count_nonzero(vec)}")
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

def serialize_datetime(obj):
    """Helper function to serialize datetime objects"""
    if isinstance(obj, datetime):
        return obj.isoformat()
    elif isinstance(obj, dict):
        return {key: serialize_datetime(value) for key, value in obj.items()}
    elif isinstance(obj, list):
        return [serialize_datetime(item) for item in obj]
    else:
        return obj

async def get_course_details(course_ids):
    """Get course details from database"""
    try:
        cursor = courses_collection.find({"courseId": {"$in": course_ids}})
        courses = []
        async for course in cursor:
            # Convert ObjectId to string
            course["_id"] = str(course["_id"])
            
            # Serialize all datetime objects in the course document
            course = serialize_datetime(course)
            
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
        
        # Debug: Log the userId from JWT
        print(f"🔍 DEBUG: Looking for user with uid: {userId}")
        
        # Find user
        user = await user_collection.find_one({ "uid" : userId })
        if not user:
            print(f"❌ DEBUG: User not found with uid: {userId}")
            return ApiResponse.send(404, {"error": "User not found"}, "User not found")
        
        print(f"✅ DEBUG: Found user: {user.get('_id')} with uid: {user.get('uid')}")
        
        # Get user enrollments - try multiple query patterns
        user_object_id = user["_id"]
        print(f"🔍 DEBUG: Looking for enrollments with userId: {user_object_id}")
        
        # Correct enrollment query - use uid field and filter by type: "course"
        enrollment_query = {
            "uid": userId,  # Use uid field (not userId)
            "type": "course"  # Filter for course enrollments only
        }
        
        print(f"🔍 DEBUG: Using correct enrollment query: {enrollment_query}")
        print(f"🔍 DEBUG: Query details - uid: '{userId}' (type: {type(userId)})")
        print(f"🔍 DEBUG: Query details - type: 'course' (type: {type('course')})")
        
        # Try multiple approaches to ensure we find the enrollments
        user_enrollments = []
        
        # Approach 1: Direct query with string values
        try:
            user_enrollments_cursor = enrollment_collection.find(enrollment_query)
            async for enrollment in user_enrollments_cursor:
                user_enrollments.append(enrollment)
            print(f"✅ DEBUG: Approach 1 - Found {len(user_enrollments)} enrollments with direct query")
        except Exception as e:
            print(f"❌ DEBUG: Approach 1 failed: {e}")
        
        # If no results, try alternative queries
        if not user_enrollments:
            print("🔍 DEBUG: Trying alternative queries...")
            
            # Approach 2: Just uid filter (no type filter)
            try:
                alt_cursor = enrollment_collection.find({"uid": userId})
                alt_enrollments = []
                async for enrollment in alt_cursor:
                    alt_enrollments.append(enrollment)
                print(f"✅ DEBUG: Approach 2 - Found {len(alt_enrollments)} enrollments with uid only")
                
                # Filter for course type manually
                for enrollment in alt_enrollments:
                    if enrollment.get("type") == "course":
                        user_enrollments.append(enrollment)
                print(f"✅ DEBUG: After manual filtering: {len(user_enrollments)} course enrollments")
            except Exception as e:
                print(f"❌ DEBUG: Approach 2 failed: {e}")
        
        print(f"📊 DEBUG: Final enrollment count: {len(user_enrollments)}")
        
        print(f"📊 DEBUG: Total enrollments found: {len(user_enrollments)}")
        
        # Debug: Show sample enrollment data if found
        if user_enrollments:
            sample_enrollment = user_enrollments[0]
            print(f"📝 DEBUG: Sample enrollment structure: {list(sample_enrollment.keys())}")
            print(f"📝 DEBUG: Sample courseId: {sample_enrollment.get('courseId', 'NOT_FOUND')}")
            print(f"📝 DEBUG: Sample progress: {sample_enrollment.get('progress', 'NOT_FOUND')}")
            print(f"📝 DEBUG: Sample quizScores: {sample_enrollment.get('quizScores', 'NOT_FOUND')}")
            print(f"📝 DEBUG: Sample uid: {sample_enrollment.get('uid', 'NOT_FOUND')}")
            print(f"📝 DEBUG: Sample type: {sample_enrollment.get('type', 'NOT_FOUND')}")
        else:
            print("❌ DEBUG: Still no enrollments found!")
            # Let's see if there are ANY documents with this uid at all
            print("🔍 DEBUG: Checking if ANY documents exist with this uid...")
            try:
                any_cursor = enrollment_collection.find({"uid": userId}).limit(1)
                any_docs = []
                async for doc in any_cursor:
                    any_docs.append(doc)
                
                if any_docs:
                    doc = any_docs[0]
                    print(f"📋 DEBUG: Found document with uid! Fields: {list(doc.keys())}")
                    print(f"📋 DEBUG: Document uid: '{doc.get('uid')}' (type: {type(doc.get('uid'))})")
                    print(f"📋 DEBUG: Document type: '{doc.get('type')}' (type: {type(doc.get('type'))})")
                    print(f"📋 DEBUG: Full document: {doc}")
                else:
                    print("❌ DEBUG: No documents found with this uid at all!")
            except Exception as e:
                print(f"❌ DEBUG: Error checking for uid documents: {e}")
        
        if not user_enrollments:
            # New user - return popular courses from different categories
            default_recommendations = [
                "PYTHON2025ENG", "REACT2025HINDI", "GIT2025HINDI", 
                "DEVOPS2025HINDI", "PYTHONDATASCIENCE2025ENGLISH"
            ]
            course_details = await get_course_details(default_recommendations)
            return ApiResponse.send(200, {
                "recommendations": course_details,
                "reason": "Popular courses for beginners",
                "predicted_categories": [],
                "total_enrollments": 0,
                "model_type": "default"
            }, "Default recommendations for new user")
        
        # Get ObjectId to courseId mapping for enrolled courses
        course_object_ids = [enrollment.get("courseId") for enrollment in user_enrollments if enrollment.get("courseId")]
        object_id_to_course_code = await map_objectid_to_courseid(course_object_ids)
        
        # Encode user interactions for ML model with proper course code mapping
        feature_vector = encode_user_interactions(user_enrollments, object_id_to_course_code)
        
        # Get ML predictions based on model type
        if MODEL_TYPE == "tensorflow":
            predicted_categories, prediction_probs = predict_categories_tensorflow(feature_vector, threshold=0.3)
        elif MODEL_TYPE == "sklearn":
            predicted_categories, prediction_probs = predict_categories_sklearn(feature_vector)
        else:
            predicted_categories = []
            prediction_probs = np.array([])
        
        print(f"Predicted categories for user {userId}: {predicted_categories}")
        
        # Get enrolled course IDs (mapped to course codes) for reference (not excluding)
        enrolled_course_ids = set()
        for enrollment in user_enrollments:
            object_id = str(enrollment.get("courseId", ""))
            if object_id in object_id_to_course_code:
                enrolled_course_ids.add(object_id_to_course_code[object_id])
        
        print(f"� DEBUG: User's enrolled courses: {enrolled_course_ids}")
        
        # Generate recommendations based on predicted categories (including enrolled courses for demo)
        recommended_courses = []
        for category in predicted_categories:
            if category in CATEGORY_TO_COURSES:
                for course_id in CATEGORY_TO_COURSES[category]:
                    if course_id not in recommended_courses:  # Only avoid duplicates
                        recommended_courses.append(course_id)
                        print(f"🎯 DEBUG: Added {course_id} from category {category}")
        
        # If no recommendations from ML, use intelligent fallback logic
        if not recommended_courses:
            # Analyze user's learning pattern and interests
            category_strength = {}
            course_performance = {}
            
            for enrollment in user_enrollments:
                # Map ObjectId to course code
                object_id = str(enrollment.get("courseId", ""))
                course_id = object_id_to_course_code.get(object_id, object_id)
                
                # Ensure progress and quiz scores are numeric
                progress_raw = enrollment.get("progress", 0)
                progress = float(progress_raw) if progress_raw else 0.0
                
                quiz_scores = enrollment.get("quizScores", [])
                if quiz_scores:
                    # Ensure quiz scores are numeric
                    numeric_quiz_scores = [float(score) for score in quiz_scores if isinstance(score, (int, float, str)) and str(score).replace('.', '').isdigit()]
                    avg_quiz = np.mean(numeric_quiz_scores) if numeric_quiz_scores else 0.0
                else:
                    avg_quiz = 0.0
                
                # Calculate overall performance score
                performance_score = (progress * 0.6) + (avg_quiz * 0.4)
                course_performance[course_id] = performance_score
                
                print(f"📊 DEBUG: {course_id} -> progress: {progress}, quiz_avg: {avg_quiz}, performance: {performance_score:.2f}")
                
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
                                if course_id not in recommended_courses:  # Only avoid duplicates
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
                                        if course_id not in recommended_courses:  # Only avoid duplicates
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
                            if next_course not in recommended_courses:  # Only avoid duplicates
                                recommended_courses.append(next_course)
                                break
        
        # Limit to top 5 recommendations
        recommended_courses = recommended_courses[:5]
        
        # Get course details
        course_details = await get_course_details(recommended_courses)
        
        if not course_details:
            return ApiResponse.send(200, {
                "recommendations": [],
                "reason": "User has enrolled in most relevant courses",
                "predicted_categories": [],
                "total_enrollments": len(user_enrollments),
                "model_type": MODEL_TYPE
            }, "No new recommendations available")
        
        return ApiResponse.send(200, {
            "recommendations": course_details,
            "predicted_categories": list(predicted_categories) if predicted_categories else [],
            "total_enrollments": len(user_enrollments),
            "model_type": MODEL_TYPE,
            "prediction_probabilities": prediction_probs.tolist() if len(prediction_probs) > 0 else []
        }, "Recommendations generated successfully")
        
    except Exception as e:
        print(f"Error in get_recommendations: {e}")
        return ApiResponse.send(500, f"Internal server error: {str(e)}")
    
    