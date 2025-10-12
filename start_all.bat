@echo off 
:: This telling that only give output of commands not input commands 

echo Starting Auth Service...
start cmd /k "cd backend\auth-service && npm run start"

echo Starting Ai Service...
start cmd /k "cd backend\ai-service && call myenv\scripts\activate && uvicorn main:app --reload"

echo Starting Frontend...
start cmd /k "cd frontend && npm run dev"

echo Starting Notification Web Socket Service...
start cmd /k "cd backend\notification-service && npm run start"

echo Starting Zookeper and Kafka...
start cmd /k "docker-compose up"

echo Starting Notification Kafka Consumer...
start cmd /k "cd backend\notification-service && node kafka/notification_consumer.js"

echo Starting Certificate Service...
start cmd /k "cd backend\certificate-service && node server.js"

echo All Services Started.

:: it waits for user input before closing the command prompt windows 
pause 