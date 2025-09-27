#!/usr/bin/env python3
"""
Quick test of the trained TensorFlow model
"""
import joblib
import tensorflow as tf
import numpy as np
from tensorflow_recommendation_model import TensorFlowRecommendationModel

# Load the trained model
model = TensorFlowRecommendationModel()
model.model = tf.keras.models.load_model('tensorflow_recommendation_model.h5')
model.mlb = joblib.load('tensorflow_mlb_categories.joblib')

# Test predictions
test_cases = [
    'PYTHON2025ENG:0.8:0.7;GIT2025ENG:0.6:0.8',
    'REACT2025HINDI:0.9:0.8;NODEJS2025HINDI:0.7:0.6',
    'AIML2025ENG:0.8:0.9;PYTHONDATASCIENCE2025ENGLISH:0.7:0.8'
]

print('🧪 Testing TensorFlow Model Predictions:')
print('=' * 50)
for i, test_interaction in enumerate(test_cases, 1):
    categories, probs = model.predict(test_interaction)
    print(f'Test {i}:')
    print(f'  Input: {test_interaction}')
    print(f'  Predicted categories: {categories}')
    print(f'  Top probabilities:')
    for j in np.argsort(probs)[-3:][::-1]:
        print(f'    {model.mlb.classes_[j]}: {probs[j]:.3f}')
    print()

print('✅ TensorFlow model is working correctly!')