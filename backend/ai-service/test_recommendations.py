#!/usr/bin/env python3
"""
Test script for recommendation system
"""
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

import joblib
import numpy as np

# Load models
try:
    rf_model = joblib.load("rf_category.joblib")
    mlb_model = joblib.load("mlb_categories.joblib")
    print("✓ Models loaded successfully!")
    print(f"Available categories: {list(mlb_model.classes_)}")
except Exception as e:
    print(f"✗ Error loading models: {e}")
    sys.exit(1)

# Master courses list
MASTER_COURSES = [
    "PYTHON2025ENG","GIT2025ENG","AIML2025ENG","UIUXHINDI","PYTHON2025HINDI",
    "FLUTTER2025EN","GIT2025HINDI","REACT2025HINDI","NODEJS2025HINDI",
    "PYTHONDATASCIENCE2025ENGLISH","DEVOPS2025HINDI"
]

def encode_interactions(interactions):
    """Encode user interactions for ML model"""
    NUM_FEATURES_PER_COURSE = 2
    INPUT_DIM = len(MASTER_COURSES) * NUM_FEATURES_PER_COURSE
    course_to_index = {c: i for i, c in enumerate(MASTER_COURSES)}
    
    vec = np.zeros(INPUT_DIM, dtype=np.float32)
    
    for course_id, progress, quiz_score in interactions:
        if course_id not in course_to_index:
            continue
        idx = course_to_index[course_id]
        base = idx * NUM_FEATURES_PER_COURSE
        vec[base] = progress
        vec[base + 1] = quiz_score
    
    return vec.reshape(1, -1)

# Test cases
test_cases = [
    {
        "name": "Python learner",
        "interactions": [
            ("PYTHON2025ENG", 0.8, 0.7),
            ("GIT2025ENG", 0.6, 0.8)
        ]
    },
    {
        "name": "Web developer",
        "interactions": [
            ("REACT2025HINDI", 0.9, 0.8),
            ("NODEJS2025HINDI", 0.7, 0.6),
            ("GIT2025HINDI", 0.8, 0.9)
        ]
    },
    {
        "name": "Data science enthusiast", 
        "interactions": [
            ("PYTHON2025ENG", 0.9, 0.9),
            ("PYTHONDATASCIENCE2025ENGLISH", 0.8, 0.7),
            ("AIML2025ENG", 0.6, 0.8)
        ]
    },
    {
        "name": "DevOps learner",
        "interactions": [
            ("GIT2025HINDI", 0.9, 0.8),
            ("DEVOPS2025HINDI", 0.7, 0.6)
        ]
    }
]

print("\n" + "="*50)
print("TESTING RECOMMENDATION SYSTEM")
print("="*50)

for test_case in test_cases:
    print(f"\nTesting: {test_case['name']}")
    print("-" * 30)
    
    # Encode interactions
    feature_vector = encode_interactions(test_case['interactions'])
    
    # Get predictions - let's debug what the model returns
    try:
        predictions = rf_model.predict(feature_vector)
        print(f"Raw predictions shape: {predictions.shape}")
        print(f"Raw predictions: {predictions}")
        
        predicted_categories = mlb_model.inverse_transform(predictions)[0]
        print(f"Predicted categories: {list(predicted_categories)}")
        
    except Exception as e:
        print(f"Error with predict: {e}")
        
        # Try predict_proba instead
        try:
            prediction_probs = rf_model.predict_proba(feature_vector)
            print(f"Prediction probabilities shape: {len(prediction_probs)} classes")
            
            # Get the most likely classes
            predictions_binary = np.zeros((1, len(mlb_model.classes_)))
            for i, class_probs in enumerate(prediction_probs):
                if len(class_probs) > 1:  # Binary classification for each class
                    predictions_binary[0, i] = class_probs[1]  # Probability of positive class
            
            # Apply threshold
            threshold = 0.5
            predictions_thresholded = (predictions_binary >= threshold).astype(int)
            predicted_categories = mlb_model.inverse_transform(predictions_thresholded)[0]
            
            print(f"Category probabilities (positive class):")
            for i, category in enumerate(mlb_model.classes_):
                if predictions_binary[0, i] > 0.1:
                    print(f"  {category}: {predictions_binary[0, i]:.3f}")
                    
        except Exception as e2:
            print(f"Error with predict_proba: {e2}")
            predicted_categories = []
    
    print(f"Enrolled courses:")
    for course_id, progress, quiz_score in test_case['interactions']:
        print(f"  - {course_id}: {progress*100:.0f}% progress, {quiz_score*100:.0f}% quiz")
    
    print(f"Predicted categories: {list(predicted_categories)}")

print("\n" + "="*50)
print("RECOMMENDATION TESTING COMPLETED")
print("="*50)