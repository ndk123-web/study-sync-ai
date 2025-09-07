import cloudinary
import cloudinary.uploader
from ..db.db import db
import os 
import tempfile

async def upload_cloudinary(file_content, unique_filename):
    try:
        print(f"☁️ Starting Cloudinary upload for: {unique_filename}")
        
        # Create a temporary file to upload
        with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as temp_file:
            # Write file content to temporary file
            temp_file.write(file_content)
            temp_file_path = temp_file.name

        try:
            # Upload to Cloudinary with specific folder
            response = cloudinary.uploader.upload(
                temp_file_path,
                resource_type="raw",   # for PDFs
                folder="study_sync/pdfs",  # custom folder path
                public_id=unique_filename.replace('.pdf', ''),  # Remove .pdf as Cloudinary adds it
                overwrite=True
            )

            pdf_url = response['secure_url']
            public_id = response['public_id']

            print("✅ Uploaded PDF URL:", pdf_url)
            print("🆔 Public ID:", public_id)
            
            return [True, pdf_url]
            
        finally:
            # Clean up temporary file
            try:
                os.unlink(temp_file_path)
                print("🗑️ Temporary file cleaned up")
            except OSError:
                pass  # File might already be deleted

    except Exception as e:
        print("❌ Error in Cloudinary upload:", str(e))
        return [False, None]
