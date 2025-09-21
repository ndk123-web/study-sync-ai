@echo off 
:: This telling that only give output of commands not input commands 

echo Starting Auth Service...
start cmd /k "cd backend\auth-service && npm run start"

echo Starting Ai Service...
start cmd /k "cd backend\ai-service && call myenv\scripts\activate && uvicorn main:app --reload"

echo Starting Frontend...
start cmd /k "cd frontend && npm run dev"

echo Starting Notification Service...
start cmd /k "cd backend\notification-service && npm run start"

echo All Services Started.

:: it waits for user input before closing the command prompt windows 
pause 