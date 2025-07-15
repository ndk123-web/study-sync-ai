# StudySync AI

**StudySync AI** is an AI-powered platform that transforms YouTube videos and study content into personalized learning experiences. It summarizes content, generates quizzes, offers topic-based note-taking, and tracks user progress — all using the power of Gemini AI and modern full-stack technologies.

---

## 🚀 Features

* 🔍 **Smart Topic Search** – Search manually or ask AI to fetch resources
* 📺 **YouTube Transcript Fetcher** – Extracts full transcript for a given video
* 📄 **AI-Powered Summarizer** – Bullet-point summaries via Gemini API
* 🤖 **Chatbot Doubt Solver** – Ask concept doubts and get real-time AI responses
* 📝 **Note-Taking per Topic** – User can save personal notes
* 🧺 **Auto-generated Quizzes** – Gemini creates MCQs based on transcript
* 📊 **Progress Tracker** – Visual overview of learning completion
* 📟 **PDF Export of Notes** – Export topic-wise notes anytime
* 🔐 **User Authentication** – Secure JWT/Firebase-based login system

---

## 🧰 Tech Stack

| Layer          | Technology                                  |
| -------------- | ------------------------------------------- |
| Frontend       | React + Vite + Tailwind CSS + Redux/Zustand |
| Backend (Auth) | Express.js + MongoDB Atlas                  |
| Backend (AI)   | FastAPI + Gemini API                        |
| AI Services    | Google Gemini 1.5 Pro                       |
| Database       | MongoDB Atlas / PostgreSQL (optional)       |
| Deployment     | Docker + Nginx + EC2                        |

---

## 🛠️ Project Structure

```
study-sync-ai/
├── backend/
│   ├── auth-service/         # Express.js for login/signup
│   └── ai-service/           # FastAPI for Gemini chat, summary, quiz
├── frontend/                 # React frontend
├── k8s/                      # Kubernetes manifests
└── README.md
```

---

## 🦪 Setup Instructions

### 1️⃣ Backend Setup (Auth + AI)

#### 🔹 Prerequisites:

* Node.js
* Python 3.11+
* MongoDB Atlas account
* Gemini API Key

#### 🔧 Setup Express Auth Service 

```bash
cd backend/auth-service
npm install
npm run dev
```

#### 🔧 Setup FastAPI AI Service

```bash
cd backend/ai-service
pip install -r requirements.txt
uvicorn main:app --reload
```

---

### 2️⃣ Frontend Setup (React)

```bash
cd frontend
npm install
npm run dev
```

---

## 📊 API Endpoints ( Example )

### FastAPI (AI)

* `POST /summarize` → Returns bullet summary from transcript
* `POST /chat` → Chatbot question answering
* `POST /quiz` → Generates MCQs from content

### Express (Auth)

* `POST /signup`
* `POST /signin`
* `GET /profile`

---

## 🧪 AI Prompt Samples

```txt
🎯 Summary Prompt:
"Summarize the following video transcript in 5 bullet points: [...]"

🧠 Quiz Prompt:
"Create 5 MCQs with answers based on this content: [...]"

💬 Chat Prompt:
"Explain 'Event Loop' in simple terms with an example"
```

---

## 🛆 Deployment Plan

* [ ] Dockerize each service
* [ ] Use Docker Compose for local development
* [ ] Deploy to EC2 or any VPS
* [ ] Set up Nginx reverse proxy (e.g., studysync.ndkdev.me)

---

## ✨ Future Scope

* Voice-based chatbot
* AI recommendation engine for study material
* Leaderboard for quiz scores
* PDF Transcript generation

---

## 👨‍💼 Author

**Navnath | @ndk123-web**
🚀 Computer Engineering Student
🔭 Passionate about AI, Cloud, and Full Stack Development
🌐 [Portfolio](https://ndkdev.me) | [LinkedIn](https://linkedin.com/in/...)

---

## 📜 License

This project is licensed under the MIT License.
