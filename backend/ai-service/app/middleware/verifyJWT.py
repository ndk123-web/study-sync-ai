from fastapi import HTTPException, Request
from firebase_admin import auth


def _build_auth_error(message: str) -> dict:
    return {"statusCode": 401, "message": message, "data": {}}


async def verifyJWT(request: Request):
    try:
        # Prefer Authorization: Bearer <token>
        token = None
        auth_header = request.headers.get("Authorization")
        print(f"DEBUG verifyJWT: request.url={request.url.path}, auth_header={auth_header[:20] if auth_header else None}")
        
        if auth_header and auth_header.lower().startswith("bearer "):
            token = auth_header.split(" ", 1)[1].strip()

        # Fallback to cookie named "token"
        if not token:
            cookie_token = request.cookies.get("token")
            print(f"DEBUG verifyJWT: cookie_token={cookie_token[:10] if cookie_token else None}")
            if cookie_token:
                token = cookie_token.strip()

        if not token:
            print("DEBUG verifyJWT: No token could be determined")
            raise HTTPException(status_code=401, detail=_build_auth_error("Token Not Found"))

        try:
            decoded = auth.verify_id_token(token)
            if not decoded:
                print("DEBUG verifyJWT: Token could not be verified")
                raise HTTPException(status_code=401, detail=_build_auth_error("Invalid Token"))
        except Exception as ver_err:
            print(f"DEBUG verifyJWT: auth.verify_id_token error: {ver_err}")
            raise HTTPException(status_code=401, detail=_build_auth_error("Invalid Token"))

        print("Verify By Firebase: ", decoded)
        return decoded

    except HTTPException:
        # bubble up to be formatted by global/HTTPException handlers
        raise
    except Exception as e:
        # Any unexpected auth error
        raise HTTPException(status_code=401, detail=_build_auth_error("Authentication Failed")) from e