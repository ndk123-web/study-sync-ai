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
from bson import ObjectId , json_util
import json
from pinecone import Pinecone, ServerlessSpec
import os 
from langchain_community.llms import Ollama
from langchain_pinecone import PineconeVectorStore
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain.chains import RetrievalQA
from langchain.text_splitter import RecursiveCharacterTextSplitter

enrollment_collection = db['enrollmentcourses']
users_collection = db['users']

def serialize_doc(doc):
    return json.loads(json_util.dumps(doc))

async def extract_text_from_pdf(pdf_url):
    try:
        # Download PDF
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

            all_text += f"\n--- Page {i+1} ---\n{text if text else ''}"

        print("📄 Extracted text preview:", all_text[:500] + "..." if len(all_text) > 500 else all_text)
        doc.close()  # Close the document to free memory
        return all_text
        
    except Exception as e:
        print(f"❌ Error extracting text from PDF: {str(e)}")
        return ""  # Return empty string instead of None

async def rag_chat_controller(userId,pdfId,prompt):
    try:
        llm = Ollama(model="mistral")
        # Use 1024-dimension embedding model to match Pinecone index exactly
        # Using a model that produces exactly 1024 dimensions
        embeddings = HuggingFaceEmbeddings(
            model_name="BAAI/bge-large-en-v1.5",
            model_kwargs={'device': 'cuda'},
            encode_kwargs={'normalize_embeddings': True}
        )
        
        # Initialize Pinecone with new API
        pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))
        index_name = "ndk"
        namespace = f"user_{userId}_pdf_{pdfId}"
        
        # Get existing index
        index = pc.Index(index_name)
        vectorstore = PineconeVectorStore(
            index=index, 
            embedding=embeddings, 
            text_key="text",
            namespace=namespace
        )
        
        retriever = vectorstore.as_retriever(search_kwargs={"k": 3})
        
        qa = RetrievalQA.from_chain_type(
        llm=llm,
        retriever=retriever,
        chain_type="stuff"
        )
        
        answer = qa.run(prompt)
        print("Answer:", answer)
        return ApiResponse.send(200, {"answer": answer}, "RAG chat response generated successfully")
    
    except Exception as e:
        print(f"❌ Error in rag_chat_controller: {str(e)}")
        return ApiError.send("Failed to process RAG chat", 500)
    
async def get_pdf_metadata_controller(userId , pdfId):
    userInstance = await users_collection.find_one({"uid": userId})
    if not userInstance:
        return ApiError.send("User not found", 404)
    
    pdfInstance = await enrollment_collection.find_one({"_id": ObjectId(pdfId), "userId": ObjectId(userInstance["_id"])})
    if not pdfInstance:
        return ApiError.send("PDF not found", 404)
    
    return ApiResponse.send(200, serialize_doc(pdfInstance), "PDF metadata fetched successfully")
    
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
                "pdfSize": (len(file_content) / 1024 / 1024),  # Size in MB
                "type": "pdf",
                "uid": userId,
                "uploadedAt": datetime.now(),
                "createdAt": datetime.now(),
            })
        
            if not response.inserted_id:
                return ApiError.send("Failed to add PDF to enrollment", 500)
            
            print("✅ PDF successfully processed and saved to database")
            
            # Extract text from PDF
            text = await extract_text_from_pdf(pdf_url=pdf_url)
            
            if not text or text.strip() == "":
                print("⚠️ No text extracted from PDF, skipping vector storage")
                return ApiResponse.send(200, {
                    "pdfUrl": pdf_url,
                    "pdfName": pdfFile.filename,
                    "enrollmentId": str(response.inserted_id),
                    "warning": "PDF uploaded but no text could be extracted"
                }, "PDF uploaded successfully (no text extracted)")
            
            # Split text into chunks
            splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=100)
            chunks = splitter.split_text(text)
            
            print(f"✂️ Split into {len(chunks)} chunks for embeddings")
            
            if len(chunks) == 0:
                print("⚠️ No chunks created, skipping vector storage")
                return ApiResponse.send(200, {
                    "pdfUrl": pdf_url,
                    "pdfName": pdfFile.filename,
                    "enrollmentId": str(response.inserted_id),
                    "warning": "PDF uploaded but no meaningful content found"
                }, "PDF uploaded successfully (no content for indexing)")
            
            # Init embeddings with 1024-dimension model to match Pinecone index exactly
            # Using a model that produces exactly 1024 dimensions
            embeddings = HuggingFaceEmbeddings(
                model_name="BAAI/bge-large-en-v1.5",
                model_kwargs={'device': 'cuda'},
                encode_kwargs={'normalize_embeddings': True}
            )
            
            # Initialize Pinecone with new API
            pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))
            index_name = "ndk"
            namespace = f"user_{userId}_pdf_{response.inserted_id}"   # 👈 unique per user+pdf

            # Get existing index and create VectorStore
            index = pc.Index(index_name)
            vectorstore = PineconeVectorStore(
                index=index, 
                embedding=embeddings, 
                text_key="text",
                namespace=namespace
            )
            
            # Add embeddings
            vectorstore.add_texts(
                texts=chunks,
                metadatas=[{"userId": str(userInstance["_id"]), "pdfId": str(response.inserted_id)}] * len(chunks)
            )
            
            print(f"📥 Stored {len(chunks)} chunks in Pinecone (namespace={namespace})")

            return ApiResponse.send(200, {
                "pdfUrl": pdf_url,
                "pdfName": pdfFile.filename,
                "enrollmentId": str(response.inserted_id)
            }, "PDF uploaded and processed successfully")
        else:
            return ApiError.send("Failed to upload PDF to cloud storage", 500)
    
    except Exception as e:
        print("❌ Error in load_pdf_controller:", str(e))
        return ApiError.send("Internal Server Error", 500)