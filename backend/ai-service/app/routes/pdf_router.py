from app.middleware.verifyJWT import verifyJWT
from pydantic import BaseModel
from fastapi import Depends , Request , Query , File , UploadFile, Form
from fastapi.routing import APIRouter
from app.utils.Cloudinary import upload_cloudinary
from ..controller.pdf_controller import load_pdf_controller , get_pdf_metadata_controller, pdf_summary_controller , rag_chat_controller, get_pdf_chats_controller
from ..utils.ApiError import ApiError


pdfRouter = APIRouter()

def _extract_uid(userData):
    if isinstance(userData, dict):
        return userData.get('uid') or userData.get('user_id') or userData.get('sub')
    return None

@pdfRouter.post('/load-pdf')
async def load_pdf(pdfFile: UploadFile = File(...), userData = Depends(verifyJWT)):
    print("Received file: ", pdfFile.filename)
    print("File content type: ", pdfFile.content_type)
    print("File size: ", pdfFile.size if hasattr(pdfFile, 'size') else 'Unknown')

    uid = _extract_uid(userData)
    if not uid:
        return ApiError.send(401, {}, "Unauthorized: uid missing")

    response = await load_pdf_controller(uid, pdfFile)
    return response

@pdfRouter.get('/get-pdf-metadata')
async def get_pdf_metadata(pdfId: str = Query(...) , userData = Depends(verifyJWT)):
    uid = _extract_uid(userData)
    if not uid:
        return ApiError.send(401, {}, "Unauthorized: uid missing")
    response = await get_pdf_metadata_controller(uid, pdfId)
    return response

class RagRequest(BaseModel):
    pdfId: str
    question: str 

@pdfRouter.post('/rag-chat')
async def rag_chat(rag_request: RagRequest , userData = Depends(verifyJWT)):
    uid = _extract_uid(userData)
    if not uid:
        return ApiError.send(401, {}, "Unauthorized: uid missing")
    response = await rag_chat_controller(uid, rag_request.pdfId, rag_request.question)
    return response

class SummaryRequest(BaseModel):
    pdfId: str
@pdfRouter.post('/get-pdf-summary')
async def get_summary(summary_request: SummaryRequest, userData = Depends(verifyJWT)):
    uid = _extract_uid(userData)
    if not uid:
        return ApiError.send(401, {}, "Unauthorized: uid missing")
    response = await pdf_summary_controller(uid, summary_request.pdfId)
    return response


@pdfRouter.get('/get-pdf-chats')
async def get_pdf_chats(pdfId: str = Query(...) , userData = Depends(verifyJWT)):
    uid = _extract_uid(userData)
    if not uid:
        return ApiError.send(401, {}, "Unauthorized: uid missing")
    response = await get_pdf_chats_controller(uid, pdfId)
    return response