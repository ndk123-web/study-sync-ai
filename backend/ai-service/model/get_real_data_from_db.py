import sys
import os
import asyncio
import pandas as pd
from datetime import datetime

# Add parent directory to path to import app module
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.db.db import db 

user_collection = db['users']
course_collection = db['courses']
enrollment_collection = db['enrollments']
quizzes_collection = db['quizzes']


async def get_user_training_data(user_id: str):
    # Check if user_id is ObjectId or string
    from bson import ObjectId
    
    # Try to match by _id (ObjectId) or uid (string)
    match_query = {}
    try:
        # Try to convert to ObjectId first
        match_query = {"_id": ObjectId(user_id)}
    except:
        # If not valid ObjectId, try uid field
        match_query = {"uid": user_id}
    
    pipeline = [
        # 1. Filter by _id or uid
        {"$match": match_query},
        
        # 2. Lookup enrollments (using _id instead of user_id)
        {"$lookup": {
            "from": "enrollments",
            "localField": "_id",
            "foreignField": "userId",  # Common field name for user reference
            "as": "enrollments"
        }},
        
        # 3. Lookup quizzes (using _id instead of user_id)  
        {"$lookup": {
            "from": "quizzes",
            "localField": "_id",
            "foreignField": "userId",  # Common field name for user reference
            "as": "quizzes"
        }},
        
        # 4. Lookup course details (for labels/categories)
        {"$lookup": {
            "from": "courses",
            "localField": "quizzes.courseId",  # Use quizzes courseId since enrollments are empty
            "foreignField": "_id",  # Courses use _id
            "as": "course_details"
        }},
    ]

    cursor = user_collection.aggregate(pipeline)
    print("Data's : ", cursor)
    user_docs = await cursor.to_list(length=None)
    if not user_docs:
        return None

    user_doc = user_docs[0]

    # ---- Build train_data record ----
    interactions = []
    labels = set()

    # Get quizzes data
    quizzes = user_doc.get("quizzes", [])
    enrollments = user_doc.get("enrollments", [])
    course_details = user_doc.get("course_details", [])

    print(f"Found {len(quizzes)} quizzes, {len(enrollments)} enrollments, {len(course_details)} courses")

    # map quizzes by courseId for quick lookup (updated field name)
    quiz_map = {}
    for q in quizzes:
        course_id = str(q["courseId"])
        score = q.get("score", 0)
        # Convert score to float if it's string
        if isinstance(score, str):
            try:
                score = float(score)
            except:
                score = 0
        quiz_map[course_id] = score

    # Process enrollments if available
    for e in enrollments:
        c_id = str(e["courseId"])  # Updated field name
        progress = e.get("progress", 0)
        quiz_score = quiz_map.get(c_id, 0)

        interactions.append({
            "course": c_id,
            "progress": progress,
            "quiz_score": quiz_score
        })

    # If no enrollments, create interactions from quizzes alone
    if not enrollments and quizzes:
        print("No enrollments found, creating interactions from quizzes...")
        for q in quizzes:
            c_id = str(q["courseId"])
            score = quiz_map.get(c_id, 0)
            
            interactions.append({
                "course": c_id,
                "progress": 100 if q.get("completed", False) else 0,  # Assume completed if quiz taken
                "quiz_score": score
            })

    # collect categories from joined course_details
    for c in course_details:
        if "category" in c:
            labels.add(c["category"])

    print(f"Generated {len(interactions)} interactions and {len(labels)} labels")
    
    return {
        "user_info": {
            "user_id": str(user_doc["_id"]),
            "uid": user_doc.get("uid", ""),
            "username": user_doc.get("username", ""),
            "email": user_doc.get("email", ""),
            "skill_points": user_doc.get("skillPoints", 0),
            "study_streaks": user_doc.get("studyStreaks", 0),
            "is_premium": user_doc.get("isPremium", False)
        },
        "interactions": interactions,
        "labels": list(labels),
        "stats": {
            "total_quizzes": len(quizzes),
            "total_enrollments": len(enrollments),
            "total_courses": len(course_details),
            "total_interactions": len(interactions)
        }
    }


# Function to create ML training dataset
async def create_ml_training_dataset():
    print("=== CREATING ML TRAINING DATASET ===")
    
    # Get all users
    all_users = await user_collection.find({}).to_list(length=None)
    print(f"Found {len(all_users)} users to process")
    
    training_dataset = []
    
    for i, user in enumerate(all_users):
        user_id = str(user["_id"])
        print(f"Processing user {i+1}/{len(all_users)}: {user.get('username', 'Unknown')}")
        
        try:
            training_data = await get_user_training_data(user_id)
            
            if training_data and training_data["interactions"]:
                # Create ML training record for this user
                user_training_record = {
                    "user_id": training_data["user_info"]["user_id"],
                    "username": training_data["user_info"]["username"],
                    "skill_points": training_data["user_info"]["skill_points"],
                    "study_streaks": training_data["user_info"]["study_streaks"],
                    "is_premium": training_data["user_info"]["is_premium"],
                    "interactions": [],
                    "labels": training_data["labels"] if training_data["labels"] else ["General"],
                    "stats": {
                        "total_courses": len(training_data["interactions"]),
                        "avg_quiz_score": 0,
                        "avg_progress": 0,
                        "completed_courses": 0
                    }
                }
                
                # Process interactions to get proper format
                total_quiz_score = 0
                total_progress = 0
                completed_count = 0
                
                for interaction in training_data["interactions"]:
                    # Convert quiz score to normalized format (0-1)
                    quiz_score = float(interaction["quiz_score"]) / 100.0 if interaction["quiz_score"] > 1 else float(interaction["quiz_score"])
                    
                    # Convert progress to normalized format (0-1)
                    progress = float(interaction["progress"]) / 100.0 if interaction["progress"] > 1 else float(interaction["progress"])
                    
                    # Add to interactions
                    user_training_record["interactions"].append({
                        "course": interaction["course"],
                        "progress": round(progress, 2),
                        "quiz_score": round(quiz_score, 2)
                    })
                    
                    # Calculate stats
                    total_quiz_score += quiz_score
                    total_progress += progress
                    if progress >= 0.8:  # 80% completion considered as completed
                        completed_count += 1
                
                # Update stats
                num_interactions = len(training_data["interactions"])
                user_training_record["stats"]["avg_quiz_score"] = round(total_quiz_score / num_interactions, 2)
                user_training_record["stats"]["avg_progress"] = round(total_progress / num_interactions, 2)
                user_training_record["stats"]["completed_courses"] = completed_count
                
                training_dataset.append(user_training_record)
                
        except Exception as e:
            print(f"Error processing user {user_id}: {e}")
    
    return training_dataset

# Function to create simple ML dataset (your requested format)
async def create_simple_ml_dataset():
    print("=== CREATING SIMPLE ML DATASET ===")
    
    # Get all users
    all_users = await user_collection.find({}).to_list(length=None)
    print(f"Found {len(all_users)} users to process")
    
    # Get all courses to map course IDs to course names and categories
    all_courses = await course_collection.find({}).to_list(length=None)
    course_map = {}
    for course in all_courses:
        course_map[str(course["_id"])] = {
            "courseId": course.get("courseId", str(course["_id"])),
            "title": course.get("title", "Unknown Course"),
            "category": course.get("category", "General")
        }
    
    simple_dataset = []
    
    for i, user in enumerate(all_users):
        user_id = str(user["_id"])
        print(f"Processing user {i+1}/{len(all_users)}: {user.get('username', 'Unknown')}")
        
        try:
            training_data = await get_user_training_data(user_id)
            
            if training_data and training_data["interactions"]:
                interactions = []
                categories = set()
                
                # Process interactions
                total_quiz_score = 0
                total_progress = 0
                completed_count = 0
                
                for interaction in training_data["interactions"]:
                    course_id = interaction["course"]
                    
                    # Get course info from course_map
                    course_info = course_map.get(course_id, {
                        "courseId": course_id,
                        "title": "Unknown",
                        "category": "General"
                    })
                    
                    # Convert to normalized format
                    quiz_score = float(interaction["quiz_score"]) / 100.0 if interaction["quiz_score"] > 1 else float(interaction["quiz_score"])
                    progress = float(interaction["progress"]) / 100.0 if interaction["progress"] > 1 else float(interaction["progress"])
                    
                    # Add to interactions with course name instead of ObjectId
                    interactions.append({
                        "course": course_info["courseId"],
                        "progress": round(progress, 2),
                        "quiz_score": round(quiz_score, 2)
                    })
                    
                    # Add category to labels
                    categories.add(course_info["category"])
                    
                    # Calculate stats
                    total_quiz_score += quiz_score
                    total_progress += progress
                    if progress >= 0.8:
                        completed_count += 1
                
                # Create simple ML record
                if interactions:  # Only add if there are interactions
                    user_info = training_data["user_info"]
                    num_interactions = len(interactions)
                    
                    simple_record = {
                        # Features
                        "features": {
                            "total_courses": num_interactions,
                            "skill_points": user_info["skill_points"],
                            "study_streaks": user_info["study_streaks"],
                            "avg_quiz_score": round(total_quiz_score / num_interactions, 2),
                            "avg_progress": round(total_progress / num_interactions, 2),
                            "completed_courses": completed_count,
                            "categories": list(categories)
                        },
                        # Interactions and Labels (as you requested)
                        "interactions": interactions,
                        "labels": list(categories)
                    }
                    
                    simple_dataset.append(simple_record)
                
        except Exception as e:
            print(f"Error processing user {user_id}: {e}")
    
    return simple_dataset

# Function to export training dataset to files
async def export_training_dataset():
    print("=== EXPORTING SIMPLE ML TRAINING DATASET ===")
    
    dataset = await create_simple_ml_dataset()
    
    if not dataset:
        print("❌ No training data found!")
        return None
    
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    
    # 1. Export as JSON (for ML training)
    json_filename = f"ml_training_dataset_{timestamp}.json"
    try:
        import json
        with open(json_filename, 'w', encoding='utf-8') as f:
            json.dump(dataset, f, indent=2, ensure_ascii=False)
        print(f"✅ JSON dataset created: {json_filename}")
    except Exception as e:
        print(f"❌ Error creating JSON file: {e}")
    
    # 2. Export as Excel (for analysis)
    excel_filename = f"ml_training_dataset_{timestamp}.xlsx"
    try:
        # Create flattened data for Excel
        excel_data = []
        interactions_data = []
        
        for i, user_record in enumerate(dataset):
            # Main user record (using features data)
            features = user_record["features"]
            excel_data.append({
                "User ID": f"User_{i+1}",
                "Total Courses": features["total_courses"],
                "Skill Points": features["skill_points"],
                "Study Streaks": features["study_streaks"],
                "Avg Quiz Score": features["avg_quiz_score"],
                "Avg Progress": features["avg_progress"],
                "Completed Courses": features["completed_courses"],
                "Categories": ", ".join(features["categories"]),
                "Export Date": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            })
            
            # Individual interactions
            for interaction in user_record["interactions"]:
                interactions_data.append({
                    "User ID": f"User_{i+1}",
                    "Course ID": interaction["course"],
                    "Progress": interaction["progress"],
                    "Quiz Score": interaction["quiz_score"],
                    "Categories": ", ".join(user_record["labels"])
                })
        
        # Create Excel with multiple sheets
        with pd.ExcelWriter(excel_filename, engine='openpyxl') as writer:
            pd.DataFrame(excel_data).to_excel(writer, sheet_name='Users Summary', index=False)
            pd.DataFrame(interactions_data).to_excel(writer, sheet_name='ML Training Data', index=False)
            
            # Stats sheet
            stats_data = [
                ["Total Users", len(dataset)],
                ["Total Interactions", sum(len(u["interactions"]) for u in dataset)],
                ["Unique Categories", len(set(cat for u in dataset for cat in u["labels"]))],
                ["Export Date", datetime.now().strftime("%Y-%m-%d %H:%M:%S")]
            ]
            pd.DataFrame(stats_data, columns=["Metric", "Value"]).to_excel(writer, sheet_name='Dataset Stats', index=False)
        
        print(f"✅ Excel dataset created: {excel_filename}")
        
    except Exception as e:
        print(f"❌ Error creating Excel file: {e}")
    
    # 3. Print sample data
    print(f"\n📊 Dataset Summary:")
    print(f"- Total Users: {len(dataset)}")
    print(f"- Total Interactions: {sum(len(u['interactions']) for u in dataset)}")
    print(f"- Categories Found: {set(cat for u in dataset for cat in u['labels'])}")
    
    print(f"\n🔍 Sample Training Record:")
    if dataset:
        sample = dataset[0]
        sample_output = {
            "features": sample["features"],
            "interactions": sample["interactions"][:2],  # Show first 2 interactions
            "labels": sample["labels"]
        }
        import json
        print(json.dumps(sample_output, indent=2))
    
    return json_filename, excel_filename

# Function to get all users training data and export to Excel
async def export_all_users_to_excel():
    print("=== EXPORTING ALL USERS TO EXCEL ===")
    
    # Get all users
    all_users = await user_collection.find({}).to_list(length=None)
    print(f"Found {len(all_users)} users to process")
    
    all_data = []
    interactions_data = []
    
    for i, user in enumerate(all_users):
        user_id = str(user["_id"])
        print(f"Processing user {i+1}/{len(all_users)}: {user.get('username', 'Unknown')}")
        
        try:
            training_data = await get_user_training_data(user_id)
            
            if training_data:
                user_info = training_data["user_info"]
                stats = training_data["stats"]
                
                # Add to main data
                all_data.append({
                    "User ID": user_info["user_id"],
                    "UID": user_info["uid"],
                    "Username": user_info["username"],
                    "Email": user_info["email"],
                    "Skill Points": user_info["skill_points"],
                    "Study Streaks": user_info["study_streaks"],
                    "Is Premium": user_info["is_premium"],
                    "Total Quizzes": stats["total_quizzes"],
                    "Total Enrollments": stats["total_enrollments"],
                    "Total Courses": stats["total_courses"],
                    "Total Interactions": stats["total_interactions"],
                    "Categories": ", ".join(training_data["labels"]),
                    "Export Date": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                })
                
                # Add interactions data
                for interaction in training_data["interactions"]:
                    interactions_data.append({
                        "User ID": user_info["user_id"],
                        "Username": user_info["username"],
                        "Course ID": interaction["course"],
                        "Progress": interaction["progress"],
                        "Quiz Score": interaction["quiz_score"],
                        "Export Date": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                    })
            else:
                # Add user with no data
                all_data.append({
                    "User ID": user_id,
                    "UID": user.get("uid", ""),
                    "Username": user.get("username", ""),
                    "Email": user.get("email", ""),
                    "Skill Points": user.get("skillPoints", 0),
                    "Study Streaks": user.get("studyStreaks", 0),
                    "Is Premium": user.get("isPremium", False),
                    "Total Quizzes": 0,
                    "Total Enrollments": 0,
                    "Total Courses": 0,
                    "Total Interactions": 0,
                    "Categories": "No Data",
                    "Export Date": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                })
                
        except Exception as e:
            print(f"Error processing user {user_id}: {e}")
    
    # Create DataFrames
    users_df = pd.DataFrame(all_data)
    interactions_df = pd.DataFrame(interactions_data)
    
    # Generate filename with timestamp
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"study_sync_training_data_{timestamp}.xlsx"
    
    # Export to Excel with multiple sheets
    try:
        with pd.ExcelWriter(filename, engine='openpyxl') as writer:
            users_df.to_excel(writer, sheet_name='Users Summary', index=False)
            if not interactions_df.empty:
                interactions_df.to_excel(writer, sheet_name='User Interactions', index=False)
            
            # Add a stats sheet
            stats_data = [
                ["Total Users", len(all_users)],
                ["Users with Training Data", len([u for u in all_data if u["Total Interactions"] > 0])],
                ["Total Interactions", len(interactions_data)],
                ["Export Date", datetime.now().strftime("%Y-%m-%d %H:%M:%S")]
            ]
            stats_df = pd.DataFrame(stats_data, columns=["Metric", "Value"])
            stats_df.to_excel(writer, sheet_name='Export Stats', index=False)
        
        print(f"✅ Excel file created successfully: {filename}")
        print(f"📊 Exported {len(all_data)} users with {len(interactions_data)} total interactions")
        return filename
        
    except Exception as e:
        print(f"❌ Error creating Excel file: {e}")
        return None

# Debug function to check what's in the database
async def debug_database():
    print("=== DATABASE DEBUG ===")
    
    # Check users collection
    print("\n1. Checking users collection:")
    users_count = await user_collection.count_documents({})
    print(f"Total users: {users_count}")
    
    if users_count > 0:
        # Get first few users
        sample_users = await user_collection.find({}).limit(3).to_list(length=3)
        for i, user in enumerate(sample_users):
            print(f"Sample user {i+1}: {user}")
    
    # Check enrollments collection
    print("\n2. Checking enrollments collection:")
    enrollments_count = await enrollment_collection.count_documents({})
    print(f"Total enrollments: {enrollments_count}")
    
    if enrollments_count > 0:
        sample_enrollments = await enrollment_collection.find({}).limit(2).to_list(length=2)
        for i, enrollment in enumerate(sample_enrollments):
            print(f"Sample enrollment {i+1}: {enrollment}")
    
    # Check courses collection
    print("\n3. Checking courses collection:")
    courses_count = await course_collection.count_documents({})
    print(f"Total courses: {courses_count}")
    
    # Check quizzes collection
    print("\n4. Checking quizzes collection:")
    quizzes_count = await quizzes_collection.count_documents({})
    print(f"Total quizzes: {quizzes_count}")
    
    if quizzes_count > 0:
        sample_quizzes = await quizzes_collection.find({}).limit(2).to_list(length=2)
        for i, quiz in enumerate(sample_quizzes):
            print(f"Sample quiz {i+1}: {quiz}")
    
    # Check courses collection samples
    print("\n5. Checking courses collection samples:")
    if courses_count > 0:
        sample_courses = await course_collection.find({}).limit(2).to_list(length=2)
        for i, course in enumerate(sample_courses):
            print(f"Sample course {i+1}: {course}")

# Test function to run the script directly
if __name__ == "__main__":
    async def test():
        print("🚀 StudySync AI - Training Data Exporter")
        print("=" * 50)
        
        # Ask user what they want to do
        print("\nOptions:")
        print("1. Debug database (check collections)")
        print("2. Test single user data")
        print("3. Create Simple ML Training Dataset (Features + Labels)")
        print("4. Export all users to Excel (old format)")
        print("5. Do everything (Debug + Test + ML Dataset)")
        
        choice = input("\nEnter your choice (1-5) or press Enter for option 5: ").strip()
        
        if not choice:
            choice = "5"
        
        if choice in ["1", "5"]:
            print("\n" + "="*20 + " DATABASE DEBUG " + "="*20)
            await debug_database()
        
        if choice in ["2", "5"]:
            print("\n" + "="*20 + " TESTING USER DATA " + "="*20)
            # Test with actual ObjectId from database
            test_user_id = "68a577abe352d765d9b79783"
            
            try:
                result = await get_user_training_data(test_user_id)
                print(f"Result for user {test_user_id}:")
                print(result)
            except Exception as e:
                print(f"Error occurred: {e}")
        
        if choice in ["3", "5"]:
            print("\n" + "="*20 + " ML TRAINING DATASET " + "="*20)
            files = await export_training_dataset()
            if files:
                print(f"\n🎉 ML Training Dataset created successfully!")
                print(f"📄 JSON File: {files[0]}")
                print(f"📊 Excel File: {files[1]}")
            else:
                print("\n❌ ML Dataset creation failed!")
        
        if choice == "4":
            print("\n" + "="*20 + " EXCEL EXPORT (OLD FORMAT) " + "="*20)
            filename = await export_all_users_to_excel()
            if filename:
                print(f"\n🎉 Success! Check the file: {filename}")
            else:
                print("\n❌ Excel export failed!")
    
    # Run the test
    asyncio.run(test())
