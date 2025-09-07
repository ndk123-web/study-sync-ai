import fitz  # PyMuPDF
import pytesseract
from PIL import Image
import io
import requests
from datetime import datetime
from ..db.db import db
from app.utils.Cloudinary import upload_cloudinary
from ..utils.ApiError import ApiError
from ..utils.ApiResponse import ApiResponse
from bson import ObjectId
import uuid

enrollment_collection = db['enrollmentcourses']
users_collection = db['users']

async def extract_text_from_pdf(pdf_url):
    # Download PDF

    pdf_url = "https://res.cloudinary.com/dmijbupsf/raw/upload/v1757249690/study_sync/pdfs/pczdlcmzzcimbwkv4ggs.pdf"

    resp = requests.get(pdf_url, timeout=30)
    resp.raise_for_status()

    doc = fitz.open(stream=resp.content, filetype="pdf")
    all_text = ""

    for i in range(len(doc)):
        page = doc[i]

        # try direct text extraction first
        text = page.get_text("text").strip()

        if not text or len(text) < 6:
            print(f"Page {i+1}: running OCR fallback")

            # render at higher resolution for better OCR
            zoom = 2.0
            mat = fitz.Matrix(zoom, zoom)
            pix = page.get_pixmap(matrix=mat, alpha=False)

            img = Image.open(io.BytesIO(pix.tobytes("png")))

            # basic preprocessing
            img = img.convert("L")  # grayscale
            # optional: simple thresholding (uncomment if needed)
            # img = img.point(lambda p: 0 if p < 140 else 255)

            # run tesseract with config
            config = "--psm 6 --oem 1"
            text = pytesseract.image_to_string(img, lang="eng", config=config).strip()

        all_text += f"\n--- Page {i+1} ---\n{text}"

    print(all_text)

async def load_pdf_controller(userId, pdfFile):
    try:
        print(f"🚀 Processing PDF upload for user: {userId}")
        print(f"📄 File details - Name: {pdfFile.filename}, Type: {pdfFile.content_type}")
        
        # Validate file type
        if pdfFile.content_type != "application/pdf":
            return ApiError.send("Invalid file type. Please upload a PDF file.", 400)
        
        # Read file content
        file_content = await pdfFile.read()
        print(f"📊 File size: {len(file_content)} bytes")
        
        # Create unique filename
        random_unique_name = f"{userId}_pdf_{str(uuid.uuid4())}.pdf"
        
        # Upload to Cloudinary
        isUploaded = await upload_cloudinary(file_content, random_unique_name)

        if isUploaded[0]:
            pdf_url = isUploaded[1] 
            print(f"☁️ PDF uploaded to: {pdf_url}")
            
            userInstance = await users_collection.find_one({"uid": userId})
            if not userInstance:
                return ApiError.send("User not found", 404)
            
            # Save to database
            response = await enrollment_collection.insert_one({
                "userId": ObjectId(userInstance["_id"]),
                "pdfLink": pdf_url,
                "pdfName": pdfFile.filename or "Unnamed PDF",
                "type": "pdf",
                "uploadedAt": datetime.now(),
                "createdAt": datetime.now(),
            })
        
            if not response.inserted_id:
                return ApiError.send("Failed to add PDF to enrollment", 500)
            
            print("✅ PDF successfully processed and saved to database")
            return ApiResponse.send(200, {
                "pdfUrl": pdf_url,
                "pdfName": pdfFile.filename,
                "enrollmentId": str(response.inserted_id)
            }, "PDF uploaded and added to enrollment successfully")
        else:
            return ApiError.send("Failed to upload PDF to cloud storage", 500)
    
    except Exception as e:
        print("❌ Error in load_pdf_controller:", str(e))
        return ApiError.send("Internal Server Error", 500)