import firebase_admin
from firebase_admin import credentials, auth
import os
import json
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

async def initialize_firebase():
    try:
        # Debug: Print environment variables (only for development)
        print(f"🔍 Debug - FIREBASE_PROJECT_ID: {os.getenv('FIREBASE_PROJECT_ID')}")
        print(f"🔍 Debug - FIREBASE_CLIENT_EMAIL: {os.getenv('FIREBASE_CLIENT_EMAIL')}")
        private_key = os.getenv("FIREBASE_PRIVATE_KEY", "")
        print(f"🔍 Debug - Private key length: {len(private_key)}")
        print(f"🔍 Debug - Private key starts with: {private_key[:50]}...")
        
        # Try to use environment variables first
        if os.getenv("FIREBASE_PROJECT_ID") and os.getenv("FIREBASE_PRIVATE_KEY") and os.getenv("FIREBASE_CLIENT_EMAIL"):
            print("🌱 Using Firebase configuration from environment variables")
            
            # Create service account dict from environment variables
            service_account = {
                "type": os.getenv("FIREBASE_TYPE", "service_account"),
                "project_id": os.getenv("FIREBASE_PROJECT_ID"),
                "private_key_id": os.getenv("FIREBASE_PRIVATE_KEY_ID"),
                "private_key": private_key.replace('\\n', '\n') if private_key else "",
                "client_email": os.getenv("FIREBASE_CLIENT_EMAIL"),
                "client_id": os.getenv("FIREBASE_CLIENT_ID"),
                "auth_uri": os.getenv("FIREBASE_AUTH_URI", "https://accounts.google.com/o/oauth2/auth"),
                "token_uri": os.getenv("FIREBASE_TOKEN_URI", "https://oauth2.googleapis.com/token"),
                "auth_provider_x509_cert_url": os.getenv("FIREBASE_AUTH_PROVIDER_X509_CERT_URL", "https://www.googleapis.com/oauth2/v1/certs"),
                "client_x509_cert_url": os.getenv("FIREBASE_CLIENT_X509_CERT_URL"),
                "universe_domain": os.getenv("FIREBASE_UNIVERSE_DOMAIN", "googleapis.com")
            }
        else:
            # Fallback to JSON file
            print("🔄 Falling back to JSON file configuration")
            cred_path = os.path.join(os.getcwd(), "app", "config", "study-sync.json")
            if os.path.exists(cred_path):
                with open(cred_path, 'r') as f:
                    service_account = json.load(f)
                print("📁 Using Firebase configuration from JSON file")
            else:
                print("❌ No Firebase configuration found (neither env vars nor JSON file)")
                return False
        
        # Validate required fields
        if not service_account["project_id"]:
            print("❌ Missing FIREBASE_PROJECT_ID")
            return False
        if not service_account["private_key"]:
            print("❌ Missing FIREBASE_PRIVATE_KEY")
            return False
        if not service_account["client_email"]:
            print("❌ Missing FIREBASE_CLIENT_EMAIL")
            return False
        
        # Additional validation for private key format
        if not service_account["private_key"].startswith("-----BEGIN PRIVATE KEY-----"):
            print("❌ Invalid private key format - must start with '-----BEGIN PRIVATE KEY-----'")
            return False
        
        print("🔍 All required Firebase environment variables present")
        print(f"📧 Client Email: {service_account['client_email']}")
        print(f"🆔 Project ID: {service_account['project_id']}")
        
        # Debug: Save service account to temp file for inspection
        temp_service_account = service_account.copy()
        temp_service_account["private_key"] = temp_service_account["private_key"][:50] + "..."
        print(f"🔍 Service Account Structure: {json.dumps(temp_service_account, indent=2)}")
        
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