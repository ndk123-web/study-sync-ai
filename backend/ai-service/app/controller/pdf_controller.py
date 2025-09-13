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
import ollama
import asyncio
from langchain_pinecone import PineconeVectorStore
from langchain_huggingface import HuggingFaceEmbeddings
from langchain.text_splitter import RecursiveCharacterTextSplitter

enrollment_collection = db['enrollmentcourses']
users_collection = db['users']
chats_collection = db['chats']

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


async def get_pdf_metadata_controller(userId , pdfId):
    userInstance = await users_collection.find_one({"uid": userId})
    if not userInstance:
        return ApiError.send(404, {}, "User not found")
    
    pdfInstance = await enrollment_collection.find_one({"_id": ObjectId(pdfId), "userId": ObjectId(userInstance["_id"])})
    if not pdfInstance:
        return ApiError.send(404, {}, "PDF not found")
    
    return ApiResponse.send(200, serialize_doc(pdfInstance), "PDF metadata fetched successfully")
    
async def load_pdf_controller(userId, pdfFile):
    try:
        print(f"🚀 Processing PDF upload for user: {userId}")
        print(f"📄 File details - Name: {pdfFile.filename}, Type: {pdfFile.content_type}")
        
        # Validate file type
        if pdfFile.content_type != "application/pdf":
            return ApiError.send(400, {}, "Invalid file type. Please upload a PDF file.")
        
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
                return ApiError.send(404, {}, "User not found")
            
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
                return ApiError.send(500, {}, "Failed to add PDF to enrollment")
            
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
                model_kwargs={'device': 'cpu'},  # Use CPU instead of CUDA
                encode_kwargs={'normalize_embeddings': True}
            )
            
            # Initialize Pinecone with new API
            pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))
            index_name = "ndk"
            namespace = f"user_{userId}_pdf_{str(response.inserted_id)}"   # 👈 unique per user+pdf (explicit str)
            
            print(f"📥 Upload: Creating namespace: {namespace}")
            print(f"🆔 Upload: PDF ID type: {type(response.inserted_id)}, value: {repr(response.inserted_id)}")

            # Get existing index and create VectorStore
            index = pc.Index(index_name)
            vectorstore = PineconeVectorStore(
                index=index, 
                embedding=embeddings, 
                text_key="text",
                namespace=namespace
            )
            
            # Add embeddings
            if len(chunks) > 0:
                print("🔤 First chunk preview:", (chunks[0] or "")[:200])
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
            return ApiError.send(500, {}, "Failed to upload PDF to cloud storage")
    
    except Exception as e:
        print("❌ Error in load_pdf_controller:", str(e))
        return ApiError.send(500, {}, "Internal Server Error")


async def rag_chat_controller(userId: str, pdfId: str, question: str):
    try:
        # Validate user and PDF enrollment
        userInstance = await users_collection.find_one({"uid": userId})
        if not userInstance:
            return ApiError.send(404, {}, "User not found")

        pdfInstance = await enrollment_collection.find_one({"_id": ObjectId(pdfId), "userId": ObjectId(userInstance["_id"])})
        if not pdfInstance:
            return ApiError.send(404, {}, "PDF not found")

        # Build Pinecone vector store for this namespace
        embeddings = HuggingFaceEmbeddings(
            model_name="BAAI/bge-large-en-v1.5",
            model_kwargs={'device': 'cpu'},
            encode_kwargs={'normalize_embeddings': True}
        )

        pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))
        index_name = "ndk"
        namespace = f"user_{userId}_pdf_{pdfId}"

        index = pc.Index(index_name)
        vectorstore = PineconeVectorStore(
            index=index,
            embedding=embeddings,
            text_key="text",
            namespace=namespace
        )

        # Debug: Describe namespace stats
        try:
            stats = index.describe_index_stats()
            ns_stats = (stats or {}).get('namespaces', {}).get(namespace, {})
            print(f"🧭 Pinecone stats for namespace '{namespace}': ", ns_stats)
        except Exception as es:
            print("⚠️ describe_index_stats failed:", str(es))

        # Try retriever.invoke first (newer pattern)
        retriever = vectorstore.as_retriever(search_kwargs={"k": 4})
        try:
            docs = await asyncio.to_thread(retriever.invoke, question)
        except Exception:
            docs = []

        # Fallback to similarity_search
        if not docs:
            try:
                docs = await asyncio.to_thread(vectorstore.similarity_search, question, 4)
            except Exception:
                docs = []

        # If still nothing, attempt a direct query via Pinecone index
        context_chunks = []
        if not docs:
            try:
                qvec = await asyncio.to_thread(embeddings.embed_query, question)
                direct = index.query(vector=qvec, top_k=4, namespace=namespace, include_metadata=True)
                matches = (direct or {}).get('matches', [])
                print("🔎 Pinecone direct query match count:", len(matches))
                if matches:
                    for m in matches:
                        meta = m.get('metadata') or {}
                        txt = meta.get('text')
                        if txt:
                            context_chunks.append(txt)
            except Exception as eq:
                print("⚠️ Pinecone direct query failed:", str(eq))

        # If still nothing after direct query, fallback to raw PDF extraction as a last resort
        if not context_chunks:
            if docs and isinstance(docs, list):
                context_chunks = [getattr(d, 'page_content', '') for d in docs if getattr(d, 'page_content', '')]
        if not context_chunks:
            # Attempt to extract directly from the stored pdf link
            pdf_url = pdfInstance.get("pdfLink")
            if pdf_url:
                extracted = await extract_text_from_pdf(pdf_url)
                if extracted:
                    # Use first ~4000 characters to keep prompt size manageable
                    context_chunks = [extracted[:4000]]

        context = "\n\n".join(context_chunks) if context_chunks else ""

        # Build prompt for Ollama
        user_prompt = f"""
You are a helpful assistant for StudySync. Use ONLY the following PDF context to answer the question concisely. If the context doesn't contain the answer, say you don't have enough information.

Context:
{context}

Question: {question}

Answer (be concise, use bullet points where helpful):
"""

        ai_response = await asyncio.to_thread(
            ollama.chat,
            model="mistral",
            messages=[
                {"role": "user", "content": user_prompt}
            ],
            options={
                "temperature": 0.3,
                "top_p": 0.9,
                "num_predict": 512
            }
        )

        answer = ai_response.get('message', {}).get('content', 'No response generated')
        
        await chats_collection.insert_one({
            "userId": userId,
            "pdfId": pdfId,
            "type": "pdf",
            "response": answer,
            "prompt": question,
        })
        
        return ApiResponse.send(200, {"answer": answer}, "RAG chat response generated")

    except Exception as e:
        print("❌ Error in rag_chat_controller:", str(e))
        return ApiError.send(500, {}, f"Internal Server Error: {str(e)}")

async def get_pdf_chats_controller(userId: str, pdfId: str):
    try:
        userInstance = await users_collection.find_one({"uid": userId})
        if not userInstance:
            return ApiError.send(404, {}, "User not found")
        
        pdfInstance = await enrollment_collection.find_one({"_id": ObjectId(pdfId), "userId": ObjectId(userInstance["_id"])})
        if not pdfInstance:
            return ApiError.send(404, {}, "PDF not found")
        
        chats = chats_collection.find({"userId": userId, "pdfId": pdfId, "type": "pdf"}).sort("createdAt", -1)
        chat_list = [serialize_doc(chat) for chat in await chats.to_list(length=100)]
        return ApiResponse.send(200, {"chats": chat_list}, "PDF chats fetched successfully")
        
    except Exception as e:
        print("❌ Error in get_pdf_chats_controller:", str(e))
        return ApiError.send(500, {}, f"Internal Server Error: {str(e)}")

async def pdf_summary_controller(userId: str, pdfId: str):
    """
    Generate a concise summary of the PDF by directly extracting text from the stored pdfLink
    and summarizing with Ollama. Pinecone is NOT used in this flow by design.
    """
    try:
        # Validate user and fetch enrollment record
        userInstance = await users_collection.find_one({"uid": userId})
        if not userInstance:
            return ApiError.send(404, {}, "User not found")

        pdfInstance = await enrollment_collection.find_one({"_id": ObjectId(pdfId), "userId": ObjectId(userInstance["_id"])})
        if not pdfInstance:
            return ApiError.send(404, {}, "PDF not found")

        pdf_url = pdfInstance.get("pdfLink")
        if not pdf_url:
            return ApiError.send(400, {}, "No PDF link found for this enrollment")

        # Extract text directly from the PDF
        extracted_text = await extract_text_from_pdf(pdf_url)
        if not extracted_text or extracted_text.strip() == "":
            return ApiError.send(500, {}, "Failed to extract text from PDF")

        # Truncate to keep prompt reasonable
        max_chars = 6000
        excerpt = extracted_text[:max_chars]

        prompt = f"""
Please provide a concise, student-friendly summary of the following PDF content. Focus on main ideas, definitions, and key takeaways. Use short paragraphs and bullet points where useful.

PDF Content:
{excerpt}

Summary:
"""

        ai_response = await asyncio.to_thread(
            ollama.chat,
            model="mistral",
            messages=[{"role": "user", "content": prompt}],
            options={
                "temperature": 0.4,
                "top_p": 0.9,
                "num_predict": 700
            }
        )

        summary_text = ai_response.get('message', {}).get('content', 'Summary generation failed')
        return ApiResponse.send(200, {"summary": summary_text}, "PDF summary generated successfully")

    except Exception as e:
        print("❌ Error in pdf_summary_controller:", str(e))
        return ApiError.send(500, {}, f"Internal Server Error: {str(e)}")