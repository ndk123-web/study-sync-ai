# requirements:
# pip install tensorflow pandas scikit-learn

import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
import tensorflow as tf
from tensorflow.keras import Sequential
from tensorflow.keras.layers import Dense, Dropout

# ----------  A. Configure your master lists  ----------
MASTER_COURSES = [
    "PYTHON2025ENG", "GIT2025ENG", "AIML2025ENG", "UIUXHINDI", "PYTHON2025HINDI",
    "FLUTTER2025EN", "GIT2025HINDI", "REACT2025HINDI", "NODEJS2025HINDI",
    "PYTHONDATASCIENCE2025ENGLISH", "DEVOPS2025HINDI"
]

CATEGORIES = [
    "PROGRAMMING", "GIT AND GITHUB", "AI/ML", "DESIGN", "LANGUAGES",
    "MOBILE", "DEVELOPMENT", "DATA SCIENCE", "DEVOPS"
]

course_to_index = {c: i for i, c in enumerate(MASTER_COURSES)}
cat_to_index = {c: i for i, c in enumerate(CATEGORIES)}
index_to_cat = {i: c for c, i in cat_to_index.items()}

NUM_FEATURES_PER_COURSE = 2  # progress, quiz_score
INPUT_DIM = len(MASTER_COURSES) * NUM_FEATURES_PER_COURSE
NUM_CATEGORIES = len(CATEGORIES)

# ----------  B. Helper: encode a single user interaction list -> fixed vector ----------
def encode_user_interactions(interactions):
    """
    interactions: list of dicts like:
      [{"course":"PYTHON2025ENG","progress":0.45,"quiz_score":0.9}, ...]
    returns: np.array shape (INPUT_DIM,)
    """
    vec = np.zeros(INPUT_DIM, dtype=np.float32)
    for item in interactions:
        c = item.get("course")
        if c not in course_to_index:
            continue
        idx = course_to_index[c]
        p = float(item.get("progress", 0.0))
        q = float(item.get("quiz_score", 0.0))
        base = idx * NUM_FEATURES_PER_COURSE
        vec[base] = np.clip(p, 0.0, 1.0)
        vec[base + 1] = np.clip(q, 0.0, 1.0)
    return vec

def encode_labels(cat_list):
    """
    cat_list: list of category names e.g. ["AI/ML","DATA SCIENCE"]
    returns multi-hot vector shape (NUM_CATEGORIES,)
    """
    y = np.zeros(NUM_CATEGORIES, dtype=np.float32)
    for c in cat_list:
        if c in cat_to_index:
            y[cat_to_index[c]] = 1.0
    return y

# ----------  C. Build a tiny synthetic dataset (replace with your real data) ----------
# Example training rows (replace these with real user rows)
train_data = [
    {
      "interactions": [
        {"course":"PYTHON2025ENG","progress":0.45,"quiz_score":0.90},
        {"course":"PYTHONDATASCIENCE2025ENGLISH","progress":0.41,"quiz_score":0.20}
      ],
      "labels": ["AI/ML","DATA SCIENCE"]
    },
    {
      "interactions":[
        {"course":"REACT2025HINDI","progress":0.7,"quiz_score":0.6},
        {"course":"GIT2025HINDI","progress":0.4,"quiz_score":0.3}
      ],
      "labels": ["PROGRAMMING","GIT AND GITHUB"]
    },
    # Add many more real rows here...
]

# Build X, y
X = np.vstack([encode_user_interactions(r["interactions"]) for r in train_data])
y = np.vstack([encode_labels(r["labels"]) for r in train_data])

# If you have a lot of data, do a proper train/test split
if len(X) > 1:
    X_train, X_val, y_train, y_val = train_test_split(X, y, test_size=0.2, random_state=42)
else:
    X_train, y_train = X, y
    X_val, y_val = X, y   # small demo only

# ----------  D. Build the Keras model ----------
model = Sequential([
    Dense(128, activation='relu', input_shape=(INPUT_DIM,)),
    Dropout(0.2),
    Dense(64, activation='relu'),
    Dropout(0.1),
    Dense(NUM_CATEGORIES, activation='sigmoid')  # multi-label
])

model.compile(optimizer='adam',
              loss='binary_crossentropy',
              metrics=[tf.keras.metrics.BinaryAccuracy(name="bin_acc")])

model.summary()

# ----------  E. Train (use real dataset, more epochs, callbacks in production) ----------
model.fit(X_train, y_train, epochs=10, batch_size=32, validation_data=(X_val, y_val))

# Save model
model.save("category_predictor.h5")
print("Saved category_predictor.h5")

# ----------  F. Inference helper ----------
def predict_categories_from_interactions(model, interactions, thresh=0.5, top_k=None):
    x = encode_user_interactions(interactions).reshape(1, -1)
    probs = model.predict(x)[0]  # probabilities per category
    if top_k:
        top_idx = probs.argsort()[-top_k:][::-1]
        return [(index_to_cat[i], float(probs[i])) for i in top_idx]
    else:
        chosen = [index_to_cat[i] for i, p in enumerate(probs) if p >= thresh]
        return [(c, float(probs[cat_to_index[c]])) for c in chosen]

# Example inference
example_input = [
    {"course":"PYTHON2025ENG","progress":0.45,"quiz_score":0.90},
    {"course":"PYTHONDATASCIENCE2025ENGLISH","progress":0.41,"quiz_score":0.20}
]
print("Predicted categories:", predict_categories_from_interactions(model, example_input, thresh=0.4, top_k=3))

# ----------  G. After categories: fetch top courses from DB (pseudo code) ----------
# Idea: When categories predicted, query your courses table:
#
# SELECT course_id, title, popularity_score
# FROM courses
# WHERE category IN (predicted_categories)
# ORDER BY popularity_score DESC
# LIMIT 5;
#
# Example in Python if you have an in-memory mapping:
category_to_courses_sorted = {
    "AI/ML": ["AIML2025ENG", "PYTHONDATASCIENCE2025ENGLISH"],
    "DATA SCIENCE": ["PYTHONDATASCIENCE2025ENGLISH", "PYTHON2025ENG"],
    "PROGRAMMING": ["PYTHON2025ENG", "PYTHON2025HINDI"],
    # fill with your real popularity ranking...
}

def recommend_courses_from_categories(predicted_categories, top_n=3):
    recs = []
    for cat in predicted_categories:
        courses = category_to_courses_sorted.get(cat, [])
        recs.extend(courses[:top_n])
    # remove duplicates and keep order
    final = []
    for c in recs:
        if c not in final:
            final.append(c)
    return final[:10]

# Use the function:
pred_cats = [c for c, p in predict_categories_from_interactions(model, example_input, top_k=3)]
print("Course recommendations (by popularity inside predicted categories):", recommend_courses_from_categories(pred_cats))
