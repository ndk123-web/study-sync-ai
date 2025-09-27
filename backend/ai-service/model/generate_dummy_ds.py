import pandas as pd
import random
import itertools

# ---------- A. Define courses and categories ----------
MASTER_COURSES = [
    "PYTHON2025ENG","GIT2025ENG","AIML2025ENG","UIUXHINDI","PYTHON2025HINDI",
    "FLUTTER2025EN","GIT2025HINDI","REACT2025HINDI","NODEJS2025HINDI",
    "PYTHONDATASCIENCE2025ENGLISH","DEVOPS2025HINDI"
]

CATEGORIES = [
    "PROGRAMMING","GIT AND GITHUB","AI/ML","DESIGN","LANGUAGES",
    "MOBILE","DEVELOPMENT","DATA SCIENCE","DEVOPS"
]

# ---------- B. Helper to encode interactions ----------
def encode_interactions(interactions_list):
    """Convert list of tuples to string 'course:progress:quiz;...'"""
    return ";".join([f"{c}:{round(p,2)}:{round(q,2)}" for c,p,q in interactions_list])

# ---------- C. Generate 1000 users ----------
dataset = []
user_id_counter = 1

# Generate all category combinations (1-3 labels)
all_combos = []
for r in range(1,4):
    all_combos.extend(itertools.combinations(CATEGORIES,r))

# First, include each combination at least once
for combo in all_combos:
    num_courses = random.randint(1,5)
    interactions = []
    courses_sample = random.sample(MASTER_COURSES, num_courses)
    for c in courses_sample:
        interactions.append((c, random.uniform(0,1), random.uniform(0,1)))
    dataset.append({
        "user_id": f"User_{user_id_counter}",
        "interactions": encode_interactions(interactions),
        "labels": ",".join(combo)
    })
    user_id_counter += 1

# Fill remaining rows up to 1000
while len(dataset) < 1000:
    num_labels = random.randint(1,3)
    labels = random.sample(CATEGORIES, num_labels)

    # Simulate cold-start users sometimes
    if random.random() < 0.1:  # 10% cold-start
        interactions = []
    else:
        num_courses = random.randint(1,10)  # recent top 10 interactions
        courses_sample = random.sample(MASTER_COURSES, num_courses)
        interactions = [(c, random.uniform(0,1), random.uniform(0,1)) for c in courses_sample]

    dataset.append({
        "user_id": f"User_{user_id_counter}",
        "interactions": encode_interactions(interactions),
        "labels": ",".join(labels)
    })
    user_id_counter += 1

# ---------- D. Shuffle dataset ----------
random.shuffle(dataset)

# ---------- E. Save CSV ----------
df = pd.DataFrame(dataset)
df.to_csv("dummy_users_1000.csv", index=False)
print("✅ Saved dummy_users_1000.csv with 1000 rows")
