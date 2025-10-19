# ✅ middleware/auth_middleware.py
from fastapi import HTTPException, Request
from firebase_admin import auth


def _build_auth_error(message: str) -> dict:
    """Standardize authentication error payload."""
    return {
        "statusCode": 401,
        "message": message,
        "data": {},
    }


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
            raise HTTPException(status_code=401, detail=_build_auth_error("Token Not Found"))

        decoded = auth.verify_id_token(token)
        if not decoded:
            raise HTTPException(status_code=401, detail=_build_auth_error("Invalid Token"))

        print("Verify By Firebase: ", decoded)
        return decoded

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=401, detail=_build_auth_error("Authentication Failed")) from e
