# StudySync AI ( Not Done Yet )

**StudySync AI** is an AI-powered platform that transforms YouTube videos and study content into personalized learning experiences. It summarizes content, generates quizzes, offers topic-based note-taking, and tracks user progress — all using the power of Gemini AI and modern full-stack technologies.

---

## 🚀 Features

- 🎥 **YouTube Video Integration** - Extract transcripts and analyze content
- 🧠 **AI-Powered Summaries** - Get concise bullet-point summaries using Gemini AI
- 📝 **Smart Note-Taking** - Real-time markdown editor with live preview and syntax highlighting
- 💬 **AI Chat Assistant** - Ask questions about course content with context-aware responses
- 🎯 **Progress Tracking** - Monitor learning progress across courses and topics
- 📊 **Analytics Dashboard** - Visualize learning trends and performance metrics
- 🔐 **Firebase Authentication** - Secure Google/GitHub OAuth integration
- 📱 **Responsive Design** - Modern UI with dark/light theme support

---

## 🧰 Tech Stack

| Layer          | Technology                                  |
| -------------- | ------------------------------------------- |
| Frontend       | React + Vite + Tailwind CSS + Zustand      |
| Backend (Auth) | Express.js + MongoDB Atlas + Firebase      |
| Backend (AI)   | FastAPI + Gemini API + Python              |
| AI Services    | Google Gemini 1.5 Pro                      |
| Database       | MongoDB Atlas                               |
| Deployment     | Docker + Nginx + EC2                       |

---

## 🛠️ Project Structure

```
study-sync-ai/
├── backend/
│   ├── auth-service/         # Express.js Auth & Course Management
│   │   ├── src/
│   │   │   ├── controllers/  # Business logic
│   │   │   ├── models/       # MongoDB schemas
│   │   │   ├── routes/       # API endpoints
│   │   │   ├── middleware/   # JWT verification
│   │   │   ├── config/       # Firebase admin config
│   │   │   └── db/           # Database connection
│   │   ├── package.json
│   │   └── .env.example
│   └── ai-service/           # FastAPI AI Services
│       ├── app/
│       │   ├── controllers/  # AI logic handlers
│       │   ├── routes/       # FastAPI routes
│       │   ├── config/       # Firebase & AI config
│       │   └── db/           # MongoDB connection
│       ├── requirements.txt
│       ├── main.py
│       └── .env.example
├── frontend/                 # React Vite Application
│   ├── src/
│   │   ├── api/              # API integration
│   │   ├── components/       # Reusable components
│   │   ├── pages/            # Route components
│   │   ├── store/            # Zustand state management
│   │   └── firebase/         # Firebase client config
│   ├── package.json
│   └── .env.example
└── README.md
```

---

## 🦪 Setup Instructions

### 1️⃣ Prerequisites

- **Node.js** (v18+ recommended)
- **Python** (v3.11+ recommended)
- **MongoDB Atlas** account
- **Local Ollama and Ollama's Mistral model**
- **Firebase** project (for authentication)

### 2️⃣ Clone Repository

```bash
git clone https://github.com/ndk123-web/study-sync-ai.git
cd study-sync-ai
```

### 3️⃣ Backend Setup

#### 🔹 Auth Service (Express.js)

```bash
cd backend/auth-service
npm install
```

**Create `.env` file:**

```env
# Database Configuration
MONGO_DB_URI=mongodb+srv://username:password@cluster.mongodb.net/
MONGO_DB_NAME=studysync

# Firebase Admin SDK
# Download service account key from Firebase Console and save as:
# backend/auth-service/src/config/study-sync-ai-1cbc2-firebase-adminsdk-fbsvc-74bc02dd8e.json

# Server Configuration
PORT=5000
```

**Start Auth Service:**

```bash
npm run dev
```

#### 🔹 AI Service (FastAPI)

```bash
cd backend/ai-service
python -m venv myenv
# Windows
myenv\Scripts\activate
# Linux/Mac
source myenv/bin/activate

pip install -r requirements.txt
```

**Create `.env` file:**

```env
# AI Configuration
BASE_PROMPT="You are an AI assistant specialized in educational content..."

# Database Configuration  
MONGO_DB_URI=mongodb+srv://username:password@cluster.mongodb.net/
MONGO_DB_NAME=studysync

# Firebase Configuration
# Download service account key from Firebase Console and save as:
# backend/ai-service/app/config/study-sync.json

# Server Configuration
DEV_MACHINE_IP=192.168.0.103  # Your local IP for LAN access
```

**Start AI Service:**

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**For Ollama**
- Install Ollama locally
- After Installation Enter Command: (approx 5GB Ai Model who knows basics ) 
```bash
ollama pull mistral
```

### 4️⃣ Frontend Setup (React)

```bash
cd frontend
npm install
```

**Create `.env` file:**

```env
# Firebase Client Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_PROJECT_ID=your-project-id
VITE_STORAGE_BUCKET=your-project.appspot.com
VITE_MESSAGING_SENDER_ID=123456789012
VITE_APP_ID=1:123456789012:web:abcdef123456
VITE_MEASUREMENT_ID=G-XXXXXXXXXX

# Encryption Secret (generate a strong secret)
VITE_ENCRYPTION_SECRET=your_32_character_encryption_key_here

# AI Service Configuration (optional for direct connection)
VITE_AI_SERVICE_HOST=localhost
VITE_AI_SERVICE_PORT=8000
```

**Start Frontend:**

```bash
npm run dev
```

### 5️⃣ Firebase Setup

1. **Create Firebase Project:**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create new project
   - Enable Authentication with Google and GitHub providers

2. **Generate Service Account Key:**
   - Go to Project Settings > Service Accounts
   - Generate new private key
   - Save as `backend/auth-service/src/config/study-sync-ai-[project-id]-firebase-adminsdk-[key-id].json`
   - Save as `backend/ai-service/app/config/study-sync.json`

3. **Get Web App Config:**
   - Go to Project Settings > General
   - Add web app and copy config values to frontend `.env`

### 6️⃣ MongoDB Atlas Setup

1. **Create MongoDB Atlas Cluster:**
   - Sign up at [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Create new cluster
   - Get connection string

2. **Configure Database Access:**
   - Create database user
   - Whitelist IP addresses
   - Update connection string in backend `.env` files

---

## 📊 API Endpoints

### 🔹 Auth Service (Express.js) - Port 5000

#### User Authentication
```http
POST /api/v1/user/create-user
POST /api/v1/user/signin
GET  /api/v1/user/profile
```

#### Course Management
```http
GET  /api/v1/courses/                    # Get all courses
GET  /api/v1/courses/:courseId           # Get specific course playlist
GET  /api/v1/courses/get-enrolled-courses # Get user's enrolled courses
POST /api/v1/courses/enroll-course       # Enroll in course
POST /api/v1/courses/change-course-progress # Update progress
POST /api/v1/courses/get-current-course-progress # Get progress
POST /api/v1/courses/track-playlist-index # Track video index
```

#### Notes Management
```http
GET  /api/v1/notes/get-notes/:courseId   # Get course notes
POST /api/v1/notes/save-notes            # Save course notes
```

### 🔹 AI Service (FastAPI) - Port 8000

#### AI Chat & Analysis
```http
POST /api/v1/chat/send-chat              # Send AI chat message
GET  /api/v1/chat/fetch-chats            # Get chat history
POST /api/v1/transcript/get-transcript   # Get video transcript
POST /api/v1/summary/get-summary         # Generate content summary
```

---

## 🧪 Sample API Requests

### Authentication
```bash
# Create User
curl -X POST http://localhost:5000/api/v1/user/create-user \
  -H "Authorization: Bearer firebase_jwt_token" \
  -H "Content-Type: application/json" \
  -d '{"username": "johndoe"}'
```

### Course Enrollment
```bash
# Enroll in Course
curl -X POST http://localhost:5000/api/v1/courses/enroll-course \
  -H "Content-Type: application/json" \
  -d '{"courseId": "react-basics-2024"}'
```

### AI Chat
```bash
# Send AI Chat
curl -X POST http://localhost:8000/api/v1/chat/send-chat \
  -H "Content-Type: application/json" \
  -d '{"courseId": "react-basics", "prompt": "Explain React hooks"}'
```

### Notes Management
```bash
# Save Notes
curl -X POST http://localhost:5000/api/v1/notes/save-notes \
  -H "Content-Type: application/json" \
  -d '{"courseId": "react-basics", "notes": "# React Notes\n## Hooks..."}'
```

---

## 🧪 AI Prompt Samples

```txt
🎯 Summary Prompt:
"Summarize the following video transcript in 5 bullet points: [transcript content]"

🧠 Quiz Prompt:
"Create 5 MCQs with answers based on this content: [content]"

💬 Chat Prompt:
"Explain 'Event Loop' in simple terms with an example based on the course content"
```

---

## 🛆 Deployment Plan

### Using Docker Compose

```yaml
version: '3.8'
services:
  auth-service:
    build: ./backend/auth-service
    ports:
      - "5000:5000"
    environment:
      - MONGO_DB_URI=${MONGO_DB_URI}
    
  ai-service:
    build: ./backend/ai-service
    ports:
      - "8000:8000"
    environment:
      - GEMINI_API_KEY=${GEMINI_API_KEY}
    
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    depends_on:
      - auth-service
      - ai-service
```

### Production Deployment (EC2 + Nginx)

1. **Docker Containers:** Containerize each service
2. **Nginx Reverse Proxy:** Route requests to appropriate services
3. **SSL Certificate:** Configure HTTPS with Let's Encrypt
4. **Environment Variables:** Secure environment configuration
5. **PM2/Systemd:** Process management for production

---

## ✨ Future Scope

- 🎙️ **Voice-based Chatbot** - Speech-to-text integration
- 🎯 **AI Recommendation Engine** - Personalized content suggestions
- 🏆 **Leaderboard System** - Gamification with quiz scores
- 📄 **PDF Generation** - Export summaries and notes
- 📱 **Mobile App** - React Native companion app
- 🔍 **Advanced Search** - Semantic search across content
- 📊 **Advanced Analytics** - Learning pattern insights

---

## 🧑‍💻 Development Guidelines

### Code Structure
- **Frontend:** Component-based architecture with Zustand for state management
- **Backend:** RESTful API design with proper error handling
- **Database:** MongoDB with proper indexing and aggregation
- **AI Integration:** Modular prompt engineering with context management

### Best Practices
- **Environment Variables:** Never commit sensitive data
- **Error Handling:** Comprehensive try-catch with proper logging
- **Authentication:** JWT + Firebase for secure access control
- **Code Quality:** ESLint, Prettier for consistent formatting

---

## 👨‍💼 Authors

**Navnath | @ndk123-web**  
**Sahil | @sahil-khilari**  
🚀 Computer Engineering Students  
🔭 Passionate about AI, Cloud, and Full Stack Development  
🌐 [Portfolio](https://ndkdev.me)

---

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

---

## 🐛 Issues & Support

If you encounter any issues or need support:

1. Check existing [Issues](https://github.com/ndk123-web/study-sync-ai/issues)
2. Create new issue with detailed description
3. Include environment details and error logs

---

## 🙏 Acknowledgments

- **Google Gemini AI** for powerful language processing (in future i will use this )
- **ollama** for powerfull local model (no api limit for this but deviece must be of high GPU / CPU )
- **Firebase** for seamless authentication
- **MongoDB Atlas** for reliable database hosting
- **React Community** for excellent documentation and tools
