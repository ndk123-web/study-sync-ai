#!/usr/bin/env python3
"""
TensorFlow-based Course Recommendation System
Build neural network model from scratch for multi-label classification
"""
import pandas as pd
import numpy as np
import tensorflow as tf
from tensorflow import keras
from sklearn.preprocessing import MultiLabelBinarizer
from sklearn.model_selection import train_test_split
import joblib
import os
from typing import List, Tuple
import json

# Master courses list (must match training data)
MASTER_COURSES = [
    "PYTHON2025ENG", "GIT2025ENG", "AIML2025ENG", "UIUXHINDI", "PYTHON2025HINDI",
    "FLUTTER2025EN", "GIT2025HINDI", "REACT2025HINDI", "NODEJS2025HINDI",
    "PYTHONDATASCIENCE2025ENGLISH", "DEVOPS2025HINDI"
]

# 9 Categories for classification
CATEGORIES = [
    "PROGRAMMING", "GIT AND GITHUB", "AI/ML", "DESIGN", "LANGUAGES", 
    "MOBILE", "DEVELOPMENT", "DATA SCIENCE", "DEVOPS"
]

print(f"🚀 Building TensorFlow Model for {len(CATEGORIES)} categories")
print(f"📚 Supporting {len(MASTER_COURSES)} courses")

class TensorFlowRecommendationModel:
    def __init__(self):
        self.model = None
        self.mlb = MultiLabelBinarizer()
        self.input_dim = len(MASTER_COURSES) * 2  # progress + quiz_score per course
        self.output_dim = len(CATEGORIES)
        self.course_to_index = {course: i for i, course in enumerate(MASTER_COURSES)}
        
    def encode_interactions(self, interactions_str: str) -> np.ndarray:
        """
        Convert interaction string to feature vector
        Format: "COURSE1:progress:quiz;COURSE2:progress:quiz"
        """
        feature_vector = np.zeros(self.input_dim, dtype=np.float32)
        
        if pd.isna(interactions_str) or interactions_str.strip() == "":
            return feature_vector
            
        # Parse interactions
        interactions = interactions_str.split(";")
        for interaction in interactions:
            parts = interaction.split(":")
            if len(parts) != 3:
                continue
                
            course, progress, quiz_score = parts
            if course not in self.course_to_index:
                continue
                
            course_idx = self.course_to_index[course]
            base_idx = course_idx * 2
            
            # Set features: [progress, quiz_score] for each course
            feature_vector[base_idx] = float(progress)
            feature_vector[base_idx + 1] = float(quiz_score)
            
        return feature_vector
    
    def encode_labels(self, labels_str: str) -> List[str]:
        """
        Convert label string to list
        Format: "CATEGORY1,CATEGORY2,CATEGORY3"
        """
        if pd.isna(labels_str) or labels_str.strip() == "":
            return []
        return [label.strip() for label in labels_str.split(",")]
    
    def load_and_preprocess_data(self, csv_path: str) -> Tuple[np.ndarray, np.ndarray]:
        """Load CSV data and convert to training format"""
        print(f"📁 Loading data from: {csv_path}")
        
        df = pd.read_csv(csv_path)
        print(f"📊 Dataset shape: {df.shape}")
        print(f"📋 Columns: {list(df.columns)}")
        
        # Encode features (X)
        print("🔄 Encoding user interactions...")
        X = np.vstack([
            self.encode_interactions(interaction) 
            for interaction in df['interactions']
        ])
        
        # Encode labels (y)
        print("🏷️ Encoding labels...")
        labels_list = [self.encode_labels(labels) for labels in df['labels']]
        y = self.mlb.fit_transform(labels_list)
        
        print(f"✅ Feature matrix shape: {X.shape}")
        print(f"✅ Label matrix shape: {y.shape}")
        print(f"📈 Categories found: {list(self.mlb.classes_)}")
        
        return X, y
    
    def build_model(self):
        """Build TensorFlow neural network for multi-label classification"""
        print("🏗️ Building TensorFlow model...")
        
        # Input layer
        inputs = keras.layers.Input(shape=(self.input_dim,), name='course_interactions')
        
        # Hidden layers with dropout for regularization
        x = keras.layers.Dense(128, activation='relu', name='dense_1')(inputs)
        x = keras.layers.Dropout(0.3)(x)
        x = keras.layers.BatchNormalization()(x)
        
        x = keras.layers.Dense(64, activation='relu', name='dense_2')(x)
        x = keras.layers.Dropout(0.2)(x)
        x = keras.layers.BatchNormalization()(x)
        
        x = keras.layers.Dense(32, activation='relu', name='dense_3')(x)
        x = keras.layers.Dropout(0.1)(x)
        
        # Output layer with sigmoid for multi-label classification
        outputs = keras.layers.Dense(
            self.output_dim, 
            activation='sigmoid', 
            name='category_predictions'
        )(x)
        
        # Create model
        self.model = keras.Model(inputs=inputs, outputs=outputs, name='RecommendationModel')
        
        # Compile with binary crossentropy for multi-label
        self.model.compile(
            optimizer=keras.optimizers.Adam(learning_rate=0.001),
            loss='binary_crossentropy',
            metrics=[
                'binary_accuracy',
                keras.metrics.Precision(),
                keras.metrics.Recall()
            ]
        )
        
        print("✅ Model built successfully!")
        print(self.model.summary())
        
    def train_model(self, X: np.ndarray, y: np.ndarray, epochs: int = 100):
        """Train the TensorFlow model"""
        print("🚀 Starting model training...")
        
        # Split data
        X_train, X_val, y_train, y_val = train_test_split(
            X, y, test_size=0.2, random_state=42, stratify=y[:, 0] if y.shape[1] > 0 else None
        )
        
        print(f"📊 Train set: {X_train.shape[0]} samples")
        print(f"📊 Validation set: {X_val.shape[0]} samples")
        
        # Callbacks
        callbacks = [
            keras.callbacks.EarlyStopping(
                monitor='val_loss',
                patience=15,
                restore_best_weights=True,
                verbose=1
            ),
            keras.callbacks.ReduceLROnPlateau(
                monitor='val_loss',
                factor=0.5,
                patience=8,
                min_lr=0.0001,
                verbose=1
            )
        ]
        
        # Train model
        history = self.model.fit(
            X_train, y_train,
            validation_data=(X_val, y_val),
            epochs=epochs,
            batch_size=32,
            callbacks=callbacks,
            verbose=1
        )
        
        # Evaluate
        print("\n📈 Final Evaluation:")
        train_loss, train_acc, train_prec, train_rec = self.model.evaluate(X_train, y_train, verbose=0)
        val_loss, val_acc, val_prec, val_rec = self.model.evaluate(X_val, y_val, verbose=0)
        
        print(f"Train - Loss: {train_loss:.4f}, Accuracy: {train_acc:.4f}")
        print(f"Val   - Loss: {val_loss:.4f}, Accuracy: {val_acc:.4f}")
        
        return history
    
    def save_model(self, model_path: str, mlb_path: str):
        """Save trained model and label binarizer"""
        print(f"💾 Saving model to: {model_path}")
        self.model.save(model_path)
        
        print(f"💾 Saving label binarizer to: {mlb_path}")
        joblib.dump(self.mlb, mlb_path)
        
        # Save category mapping for reference
        mapping_path = model_path.replace('.h5', '_categories.json')
        category_mapping = {
            'categories': list(self.mlb.classes_),
            'courses': MASTER_COURSES,
            'input_dim': self.input_dim,
            'output_dim': self.output_dim
        }
        
        with open(mapping_path, 'w') as f:
            json.dump(category_mapping, f, indent=2)
        
        print(f"💾 Saved category mapping to: {mapping_path}")
        print("✅ All files saved successfully!")
    
    def predict(self, interactions_str: str, threshold: float = 0.5) -> Tuple[List[str], np.ndarray]:
        """Make prediction for user interactions"""
        feature_vector = self.encode_interactions(interactions_str).reshape(1, -1)
        predictions = self.model.predict(feature_vector, verbose=0)[0]
        
        # Apply threshold
        binary_predictions = (predictions >= threshold).astype(int).reshape(1, -1)
        predicted_categories = self.mlb.inverse_transform(binary_predictions)[0]
        
        return list(predicted_categories), predictions

def main():
    """Main training pipeline"""
    print("=" * 60)
    print("🤖 TENSORFLOW RECOMMENDATION MODEL TRAINING")
    print("=" * 60)
    
    # Initialize model
    model = TensorFlowRecommendationModel()
    
    # Load and preprocess data
    csv_path = "dummy_users_1000.csv"
    if not os.path.exists(csv_path):
        csv_path = "model/dummy_users_1000.csv"
    
    X, y = model.load_and_preprocess_data(csv_path)
    
    # Build model
    model.build_model()
    
    # Train model
    history = model.train_model(X, y, epochs=150)
    
    # Save model
    model.save_model(
        model_path="tensorflow_recommendation_model.h5",
        mlb_path="tensorflow_mlb_categories.joblib"
    )
    
    # Test predictions
    print("\n🧪 Testing predictions:")
    test_cases = [
        "PYTHON2025ENG:0.8:0.7;GIT2025ENG:0.6:0.8",
        "REACT2025HINDI:0.9:0.8;NODEJS2025HINDI:0.7:0.6",
        "AIML2025ENG:0.8:0.9;PYTHONDATASCIENCE2025ENGLISH:0.7:0.8"
    ]
    
    for i, test_interaction in enumerate(test_cases, 1):
        categories, probs = model.predict(test_interaction)
        print(f"\nTest {i}:")
        print(f"  Input: {test_interaction}")
        print(f"  Predicted categories: {categories}")
        print(f"  Probabilities: {[f'{p:.3f}' for p in probs]}")
    
    print("\n" + "=" * 60)
    print("✅ TRAINING COMPLETED SUCCESSFULLY!")
    print("=" * 60)

if __name__ == "__main__":
    main()