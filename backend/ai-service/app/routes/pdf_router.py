from app.middleware.verifyJWT import verifyJWT
from pydantic import BaseModel
from fastapi import Depends , Request , Query , File , UploadFile, Form
from fastapi.routing import APIRouter
from app.utils.Cloudinary import upload_cloudinary
from ..controller.pdf_controller import load_pdf_controller

pdfRouter = APIRouter()

@pdfRouter.post('/load-pdf')
async def load_pdf(pdfFile: UploadFile = File(...), userData = Depends(verifyJWT)):
    
    print("Received file: ", pdfFile.filename)
    print("File content type: ", pdfFile.content_type)
    print("File size: ", pdfFile.size if hasattr(pdfFile, 'size') else 'Unknown')
    
    response = await load_pdf_controller(userData['uid'], pdfFile)
    return response
