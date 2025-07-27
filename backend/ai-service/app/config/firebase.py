import firebase_admin
from firebase_admin import credentials, auth
import os

async def initialize_firebase():
    cred_path = os.path.join(os.getcwd(), "app", "config", "study-sync.json")
    cred = credentials.Certificate(cred_path)

    if not firebase_admin._apps:
        firebase_admin.initialize_app(cred)
        print("✅ Firebase Admin initialized.")
    else:
        print("⚠️ Firebase Admin already initialized.")

def check_firebase_connection():
    user_list = auth.list_users().iterate_all()
    print("✅ Firebase Auth users found:")
    for user in user_list:
        print(f"Email: {user.email}")