from fastapi import Request
# from jose import jwt
import os
from firebase_admin import auth
from app.utils.ApiError import ApiError
from app.utils.ApiResponse import ApiResponse

async def verifyJWT(request: Request):
    try:
        auth_header = request.headers.get("Authorization")
        token = None

        if auth_header:
            parts = auth_header.split(" ")
            if len(parts) == 2:
                token = parts[1]
        else:
            token = request.cookies.get("token")

        if not token:
            return ApiError.send(
                statusCode=401,
                data={},
                message="Token Not Found"
            )

        decoded = auth.verify_id_token(token)
        if not decoded:
            return ApiError.send(
                401,
                data={},
                message="Invalid Token"
            )

        print("Verify By Firebase: ", decoded)
        return decoded

    except Exception as e:
        return {"error": str(e)}