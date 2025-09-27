# requirements:
# pip install pandas scikit-learn joblib

import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import MultiLabelBinarizer
import joblib

# ---------- A. Load CSV ----------
file_name = "dummy_users_1000.csv"  # Your 1000-row dataset
df = pd.read_csv(file_name)
print("Dataset preview:")
print(df.head())
print("Total rows:", df.shape[0])

# ---------- B. Build feature space ----------
MASTER_COURSES = [
    "PYTHON2025ENG","GIT2025ENG","AIML2025ENG","UIUXHINDI","PYTHON2025HINDI",
    "FLUTTER2025EN","GIT2025HINDI","REACT2025HINDI","NODEJS2025HINDI",
    "PYTHONDATASCIENCE2025ENGLISH","DEVOPS2025HINDI"
]

NUM_FEATURES_PER_COURSE = 2  # progress, quiz_score
INPUT_DIM = len(MASTER_COURSES) * NUM_FEATURES_PER_COURSE
course_to_index = {c: i for i, c in enumerate(MASTER_COURSES)}

def encode_interactions(interaction_str):
    vec = np.zeros(INPUT_DIM, dtype=np.float32)
    if pd.isna(interaction_str) or interaction_str.strip() == "":
        return vec
    items = interaction_str.split(";")
    for item in items:
        parts = item.split(":")
        if len(parts) != 3:
            continue
        course, prog, quiz = parts
        if course not in course_to_index:
            continue
        idx = course_to_index[course]
        base = idx * NUM_FEATURES_PER_COURSE
        vec[base] = float(prog)
        vec[base + 1] = float(quiz)
    return vec

# Build X
X = np.vstack(df["interactions"].apply(encode_interactions).values)

# ---------- C. Encode labels ----------
df["labels_list"] = df["labels"].apply(lambda x: [c.strip() for c in str(x).split(",")])
mlb = MultiLabelBinarizer()
y = mlb.fit_transform(df["labels_list"])
print("Categories:", mlb.classes_)

# ---------- D. Train on all rows ----------
clf = RandomForestClassifier(n_estimators=200, random_state=42)
clf.fit(X, y)
print("\n✅ Random Forest trained on all 1000 rows")

# ---------- E. Save model and MultiLabelBinarizer ----------
joblib.dump(clf, "rf_category.joblib")
joblib.dump(mlb, "mlb_categories.joblib")
print("✅ Model and MultiLabelBinarizer saved")

# ---------- F. Load model and test ----------
# Later you can load them like this:
loaded_clf = joblib.load("rf_category.joblib")
loaded_mlb = joblib.load("mlb_categories.joblib")

# ---------- G. Example prediction ----------
example = "GIT2025HINDI:0.45:0.2;AIML2025ENG:0.75:0.57;PYTHON2025ENG:0.6:0.8"
example_vec = encode_interactions(example).reshape(1, -1)
pred = loaded_clf.predict(example_vec)
pred_labels = loaded_mlb.inverse_transform(pred)

print("\nExample interactions:", example)
print("Predicted categories:", pred_labels)

# ---------- H. Optional: Test on entire CSV ----------
# Predict for all users and store in DataFrame
X_all = np.vstack(df["interactions"].apply(encode_interactions).values)
pred_all = loaded_clf.predict(X_all)
pred_labels_all = loaded_mlb.inverse_transform(pred_all)

df["predicted_labels"] = [",".join(labels) for labels in pred_labels_all]
df.to_csv("dummy_users_1000_predicted.csv", index=False)
print("✅ Predictions for all users saved to dummy_users_1000_predicted.csv")
