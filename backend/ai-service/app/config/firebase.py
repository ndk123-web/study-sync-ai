import firebase_admin
from firebase_admin import credentials, auth
import os
import json

async def initialize_firebase():
    try:
        # Create service account dict from environment variables
        service_account = {
            "type": os.getenv("FIREBASE_TYPE"),
            "project_id": os.getenv("FIREBASE_PROJECT_ID"),
            "private_key_id": os.getenv("FIREBASE_PRIVATE_KEY_ID"),
            "private_key": os.getenv("FIREBASE_PRIVATE_KEY", "").replace('\\n', '\n'),
            "client_email": os.getenv("FIREBASE_CLIENT_EMAIL"),
            "client_id": os.getenv("FIREBASE_CLIENT_ID"),
            "auth_uri": os.getenv("FIREBASE_AUTH_URI"),
            "token_uri": os.getenv("FIREBASE_TOKEN_URI"),
            "auth_provider_x509_cert_url": os.getenv("FIREBASE_AUTH_PROVIDER_X509_CERT_URL"),
            "client_x509_cert_url": os.getenv("FIREBASE_CLIENT_X509_CERT_URL"),
            "universe_domain": os.getenv("FIREBASE_UNIVERSE_DOMAIN")
        }
        
        # Validate required fields
        if not service_account["project_id"] or not service_account["private_key"] or not service_account["client_email"]:
            print("❌ Missing required Firebase environment variables")
            print("Required: FIREBASE_PROJECT_ID, FIREBASE_PRIVATE_KEY, FIREBASE_CLIENT_EMAIL")
            return False
        
        cred = credentials.Certificate(service_account)

        if not firebase_admin._apps:
            firebase_admin.initialize_app(cred)
            print("✅ Firebase Admin initialized from environment variables.")
        else:
            print("⚠️ Firebase Admin already initialized.")
        
        return True
    except Exception as e:
        print(f"❌ Firebase initialization failed: {e}")
        return False

def check_firebase_connection():
    try:
        user_list = auth.list_users().iterate_all()
        print("✅ Firebase Auth users found:")
        for user in user_list:
            print(f"Email: {user.email}")
    except Exception as e:
        print(f"❌ Firebase connection check failed: {e}")