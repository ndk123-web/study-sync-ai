from fastapi.responses import JSONResponse

class ApiResponse:
    
    @staticmethod
    def send(statusCode , data , message = "Success"):
        return JSONResponse(
            status_code=statusCode,
            content={
                'statusCode': statusCode,
                'message': message,
                'data': data,  
            }
        )
