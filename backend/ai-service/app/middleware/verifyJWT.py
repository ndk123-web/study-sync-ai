from fastapi import HTTPException, Request
from firebase_admin import auth


def _build_auth_error(message: str) -> dict:
    return {"statusCode": 401, "message": message, "data": {}}


async def verifyJWT(request: Request):
    try:
        # Prefer Authorization: Bearer <token>
        token = None
        auth_header = request.headers.get("Authorization")
        if auth_header and auth_header.lower().startswith("Bearer "):
            token = auth_header.split(" ", 1)[1].strip()

        # Fallback to cookie named "token"
        if not token:
            cookie_token = request.cookies.get("token")
            if cookie_token:
                token = cookie_token.strip()

        if not token:
            raise HTTPException(status_code=401, detail=_build_auth_error("Token Not Found"))

        decoded = auth.verify_id_token(token)
        if not decoded:
            raise HTTPException(status_code=401, detail=_build_auth_error("Invalid Token"))

        print("Verify By Firebase: ", decoded)
        return decoded

    except HTTPException:
        # bubble up to be formatted by global/HTTPException handlers
        raise
    except Exception as e:
        # Any unexpected auth error
        raise HTTPException(status_code=401, detail=_build_auth_error("Authentication Failed")) from e