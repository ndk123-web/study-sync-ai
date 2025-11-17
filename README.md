<div align="center">

<img src="./frontend/public/zap.png" width="100" alt="TaskPlexus" style="filter: drop-shadow(0 0 20px rgba(102, 126, 234, 0.6));" />


# 🎓 StudySync AI - Intelligent Learning Platform

**StudySync AI** is a comprehensive AI-powered learning management system that transforms YouTube videos, PDFs, and study content into personalized, interactive learning experiences. The platform features real-time AI chat, quiz generation, progress tracking, intelligent course recommendations, and real-time notifications — all powered by Ollama AI, TensorFlow, and modern full-stack technologies.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![Python](https://img.shields.io/badge/Python-3.11+-blue.svg)](https://www.python.org/)
[![React](https://img.shields.io/badge/React-19.1-61DAFB.svg)](https://reactjs.org/)

---

## ✨ Features

### 🎥 **Video Learning & Analysis**
- YouTube video integration with automatic transcript extraction
- AI-powered video summaries with key points
- Interactive video chat with context-aware AI responses
- Timestamp-based navigation
- Progress tracking per video

### 📄 **PDF Processing & Interaction**
- Upload and process PDF documents
- AI-powered PDF summarization
- Interactive PDF chat assistant
- Extract and discuss specific sections
- Cloudinary-based PDF storage

### 🤖 **AI-Powered Learning**
- **Ollama AI Integration** - Local, privacy-focused AI model (Mistral)
- Context-aware chat responses based on course content
- Intelligent quiz generation with multiple difficulty levels
- Automatic content summarization
- Real-time AI assistance

### 🎯 **Advanced Recommendation System**
- **TensorFlow Neural Network** - Deep learning-based course recommendations
- Personalized course suggestions based on:
  - Learning progress
  - Quiz performance
  - Category preferences
  - Historical interactions
- Multi-label classification across 9 course categories
- Real-time prediction with 1024-dimensional embeddings

### 📊 **Analytics & Tracking**
- Comprehensive learning dashboard
- Progress tracking across multiple courses
- Quiz performance analytics
- Topic-wise performance insights
- Trend analysis with yearly/monthly views
- Activity timeline tracking

### � **Real-time Notifications**
- **Kafka + WebSocket Architecture**
- Real-time course updates
- Progress milestone notifications
- Quiz completion alerts ( future )
- Firebase Cloud Messaging integration ( future )

### 📝 **Smart Note-Taking**
- Real-time markdown editor
- Course-specific notes management
- Sync notes across devices
- Auto-save functionality

### 🔐 **Secure Authentication**
- Firebase Authentication
- Google OAuth integration
- GitHub OAuth integration
- JWT-based API security
- Role-based access control (Admin/User) (username: admin@gmail.com , password: admin)

### � **Certificate Generation**
- **Automated Certificate Generation** - PDF certificates upon course completion
- **Puppeteer-based PDF Creation** - Professional certificate templates with EJS
- **Cloudinary Integration** - Secure cloud storage and CDN delivery
- **Dynamic Certificate Content** - User name, course title, completion date
- **Downloadable Certificates** - Direct download and sharing capabilities
- **Certificate Management** - List, view, and delete certificates

### �🎨 **Modern UI/UX**
- Responsive design for all devices
- Dark/Light theme support
- Smooth animations with Lucide React
- Interactive charts with Recharts & Chart.js
- Tailwind CSS styling

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND (React + Vite)                 │
│                    Port: 5173 (Development)                     │
│                                                                 │
│  • Firebase Auth  • Zustand Store  • Axios API  • Socket.io     │
└────────────────┬────────────────────────────────────────────────┘
                 │
                 ├──────────────────┬───────────────────┬─────────────────────┐
                 │                  │                   │                     │
      ┌──────────▼──────────┐ ┌─────▼─────────┐ ┌──────▼──────────┐  ┌──────▼──────┐
      │   AUTH SERVICE      │ │ CERTIFICATE   │ │    AI SERVICE   │  │ NOTIFICATION│
      │   (Express.js)      │ │   SERVICE     │ │    (FastAPI)    │  │  SERVICE    │
      │   Port: 5000        │ │ (Express.js)  │ │   Port: 8000    │  │  Port: 3001 │
      │                     │ │  Port: 5001   │ │                 │  │             │
      │ • User Management   │ │               │ │ • Ollama AI     │  │ • WebSocket │
      │ • Course CRUD       │ │ • PDF Gen     │ │ • TensorFlow ML │  │ • Kafka     │
      │ • Enrollment        │ │ • Cloudinary  │ │ • PDF Process   │  │ • FCM       │
      │ • Progress Tracking │ │ • EJS Render  │ │ • Video Transc  │  │             │
      │ • Notes Management  │ │ • Puppeteer   │ │ • Quiz Gen      │  │             │
      │ • JWT Verification  │ │ • Certificate │ │ • Cloudinary    │  │             │
      └──────────┬──────────┘ └─────┬─────────┘ └──────┬──────────┘  └──────┬──────┘
                 │                          │                     │
                 └───────────┬──────────────┴─────────────────────┘
                             │
                    ┌────────▼────────┐        ┌─────────────────┐
                    │  MongoDB Atlas  │        │  Kafka Cluster  │
                    │                 │        │  (Docker)       │
                    │ • Users         │        │                 │
                    │ • Courses       │        │ • Zookeeper     │
                    │ • Enrollments   │        │ • Kafka Broker  │
                    │ • Notes         │        └─────────────────┘
                    │ • Quizzes       │
                    │ • Chat History  │
                    └─────────────────┘
```

---

## 🧰 Tech Stack

### Frontend
- **React 19.1** - UI framework
- **Vite 7.0** - Build tool & dev server
- **Tailwind CSS 4.1** - Utility-first CSS
- **Zustand 5.0** - State management
- **React Router 7.6** - Client-side routing
- **Axios 1.10** - HTTP client
- **Socket.io Client 4.8** - Real-time communication
- **Chart.js + Recharts** - Data visualization
- **Firebase 11.10** - Authentication
- **Lucide React** - Icon library
- **Crypto-js** - Encryption

### Backend - Auth Service
- **Node.js 18+** - Runtime
- **Express.js 5.1** - Web framework
- **Mongoose 8.16** - MongoDB ODM
- **Firebase Admin 13.4** - Server-side auth
- **KafkaJS 2.2** - Kafka client
- **Bcrypt 6.0** - Password hashing
- **Cookie-parser** - Cookie handling

### Backend - Certificate Service
- **Node.js 18+** - Runtime
- **Express.js 5.1** - Web framework
- **Puppeteer 23.0** - PDF generation
- **EJS 3.1** - Template engine
- **Cloudinary 2.7** - PDF storage & CDN
- **dotenv** - Environment configuration

### Backend - AI Service
- **Python 3.11+** - Runtime
- **FastAPI 0.115** - Web framework
- **Ollama 0.5** - Local AI model
- **TensorFlow 2.20** - ML recommendations
- **PineCone** - To Store PDF Contents
- **Scikit-learn 1.7** - ML algorithms
- **Motor 3.7** - Async MongoDB driver
- **Cloudinary 1.44** - Media storage
- **PyMuPDF 1.26** - PDF processing
- **youtube-transcript-api 1.2** - Video transcripts
- **Pandas + NumPy** - Data processing

### Backend - Notification Service
- **Express.js 5.1** - Web framework
- **Socket.io 4.8** - WebSocket server
- **KafkaJS 2.2** - Event streaming
- **Firebase Admin 13.5** - Push notifications

### Infrastructure
- **MongoDB Atlas** - Cloud database
- **Docker + Docker Compose** - Containerization
- **Apache Kafka** - Event streaming
- **Zookeeper** - Kafka coordination
- **Cloudinary** - Media CDN

---

## � Project Structure

```
study-sync-ai/
├── backend/
│   ├── auth-service/                   # Express.js Auth & Course Management
│   │   ├── src/
│   │   │   ├── controllers/            # Business logic
│   │   │   │   ├── user.controllers.js
│   │   │   │   ├── course.controllers.js
│   │   │   │   ├── notes.controllers.js
│   │   │   │   ├── dashboard.controller.js
│   │   │   │   ├── admin.controller.js
│   │   │   │   ├── video.controller.js
│   │   │   │   └── chat.controller.js
│   │   │   ├── models/                 # MongoDB schemas
│   │   │   ├── routes/                 # API endpoints
│   │   │   ├── middleware/             # JWT & Auth verification
│   │   │   ├── config/                 # Firebase admin SDK
│   │   │   ├── db/                     # Database connection
│   │   │   └── utils/                  # Helper functions
│   │   ├── kafka/                      # Kafka producer
│   │   ├── package.json
│   │   └── .env
│   │
│   ├── certificate-service/            # Express.js Certificate Generation
│   │   ├── server.js                   # Main server file
│   │   ├── templates/
│   │   │   └── certificate.ejs         # Certificate HTML template
│   │   ├── assets/
│   │   │   └── logo.png               # StudySync logo
│   │   ├── package.json
│   │   ├── .env
│   │   └── TEST_COMMANDS.md           # API testing commands
│   │
│   ├── ai-service/                     # FastAPI AI Services
│   │   ├── app/
│   │   │   ├── controller/
│   │   │   │   ├── chat_controller.py          # AI chat logic
│   │   │   │   ├── pdf_controller.py           # PDF processing
│   │   │   │   ├── quiz_controller.py          # Quiz generation
│   │   │   │   ├── recommend_controller.py     # ML recommendations
│   │   │   │   ├── summary_controller.py       # Content summarization
│   │   │   │   └── transcript_controller.py    # Video transcripts
│   │   │   ├── routes/                 # FastAPI routes
│   │   │   ├── config/                 # Firebase & configs
│   │   │   ├── db/                     # MongoDB async connection
│   │   │   ├── middleware/             # JWT verification
│   │   │   └── utils/                  # Cloudinary, API responses
│   │   ├── model/                      # ML training scripts
│   │   │   ├── tensorflow_recommendation_model.py
│   │   │   ├── study_sync_recommend_rf.py
│   │   │   └── generate_dummy_ds.py
│   │   ├── myenv/                      # Python virtual environment
│   │   ├── requirements.txt
│   │   ├── main.py                     # FastAPI app entry
│   │   ├── tensorflow_recommendation_model.h5    # Trained model
│   │   ├── tensorflow_mlb_categories.joblib      # Label encoder
│   │   └── .env
│   │
│   └── notification-service/           # WebSocket & Kafka Consumer
│       ├── app/
│       │   └── index.js                # Socket.io server
│       ├── kafka/
│       │   ├── notification_consumer.js
│       │   └── test_producer.js
│       ├── config/                     # Firebase admin SDK
│       ├── package.json
│       └── .env
│
├── frontend/                           # React Vite Application
│   ├── src/
│   │   ├── api/                        # 25+ API integration modules
│   │   │   ├── authUtils.js
│   │   │   ├── GetAllCoursesApi.js
│   │   │   ├── EnrollmentCourseApi.js
│   │   │   ├── SendAiChatApi.js
│   │   │   ├── GetRecommendedCoursesApi.js
│   │   │   └── ... (20+ more APIs)
│   │   ├── components/                 # Reusable UI components
│   │   │   ├── Header.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── ProtectedLayout.jsx
│   │   │   └── ... (10+ components)
│   │   ├── pages/                      # Route pages
│   │   │   ├── Home.jsx
│   │   │   ├── Courses.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── VideoInteraction.jsx
│   │   │   ├── PdfInteraction.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   └── ... (5+ pages)
│   │   ├── store/                      # Zustand state management
│   │   │   ├── store.js
│   │   │   └── slices/                 # State slices
│   │   ├── firebase/                   # Firebase client config
│   │   ├── router/                     # React Router setup
│   │   └── assets/                     # Images, icons
│   ├── package.json
│   ├── vite.config.js
│   └── .env
│
├── docker-compose.yml                  # Kafka + Zookeeper
├── start_all.bat                       # Windows startup script
├── sample_courses.json                 # Sample course data
└── README.md
```

---

## 🚀 Complete Setup Guide

### ⚠️ Prerequisites

Before starting, ensure you have the following installed:

| Tool | Version | Download Link | Purpose |
|------|---------|---------------|---------|
| **Node.js** | v18.0+ | [nodejs.org](https://nodejs.org/) | Backend services & frontend |
| **Python** | v3.11+ | [python.org](https://www.python.org/) | AI service |
| **Docker Desktop** | Latest | [docker.com](https://www.docker.com/) | Kafka & Zookeeper |
| **Git** | Latest | [git-scm.com](https://git-scm.com/) | Version control |
| **Ollama** | Latest | [ollama.ai](https://ollama.ai/) | Local AI model |

**Accounts Required:**
- MongoDB Atlas account (free tier available)
- Firebase project (free tier available)
- Cloudinary account (free tier available)
- PineCone Account (free tier available)
---

### 📥 Step 1: Clone Repository

```bash
git clone https://github.com/ndk123-web/study-sync-ai.git
cd study-sync-ai
```

---

### 🔥 Step 2: Firebase Setup

#### 2.1 Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add Project"**
3. Enter project name (e.g., `study-sync-ai`)
4. Disable Google Analytics (optional)
5. Click **"Create Project"**

#### 2.2 Enable Authentication

1. In Firebase Console, go to **Authentication** → **Sign-in method**
2. Enable **Google** provider
3. Enable **GitHub** provider (optional)
4. Save changes

#### 2.3 Generate Service Account Key (For Backend)

1. Go to **Project Settings** (⚙️ icon) → **Service Accounts**
2. Click **"Generate New Private Key"**
3. Download the JSON file
4. **Rename** it to `study-sync-ai-firebase-adminsdk.json`
5. **Copy** this file to **THREE** locations:
   ```
   backend/auth-service/src/config/study-sync-ai-firebase-adminsdk.json
   backend/ai-service/app/config/study-sync.json
   backend/notification-service/config/study-sync-ai-1cbc2-firebase-adminsdk-fbsvc-74bc02dd8e.json
   ```

#### 2.4 Get Web App Configuration (For Frontend)

1. In Firebase Console, go to **Project Settings** → **General**
2. Scroll to **"Your apps"** section
3. Click **Web app** icon (`</>`)
4. Register app with nickname (e.g., `studysync-web`)
5. Copy the config values (you'll need these for `.env` file)

---

### 🗄️ Step 3: MongoDB Atlas Setup

#### 3.1 Create Cluster

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Sign up / Log in
3. Create a **FREE** cluster (M0 Sandbox)
4. Choose cloud provider & region (closest to you)
5. Cluster name: `study-sync-cluster`
6. Click **"Create Cluster"** (takes 3-5 minutes)

#### 3.2 Create Database User

1. Go to **Database Access** (left sidebar)
2. Click **"Add New Database User"**
3. Choose **"Password"** authentication
4. Username: `studysync_user`
5. Password: Generate strong password (save it!)
6. User Privileges: **"Atlas Admin"**
7. Click **"Add User"**

#### 3.3 Whitelist IP Address

1. Go to **Network Access** (left sidebar)
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (for development)
   - IP: `0.0.0.0/0`
4. Click **"Confirm"**

#### 3.4 Get Connection String

1. Go to **Database** → **Connect**
2. Choose **"Connect your application"**
3. Driver: **Node.js** / Version: **4.1 or later**
4. Copy connection string:
   ```
   mongodb+srv://studysync_user:<password>@study-sync-cluster.xxxxx.mongodb.net/
   ```
5. Replace `<password>` with your actual password
6. Save this connection string for `.env` files

#### 3.5 Create Database

1. Go to **Database** → **Browse Collections**
2. Click **"Add My Own Data"**
3. Database name: `study-sync`
4. Collection name: `users`
5. Click **"Create"**

#### 3.6 Import Sample Courses (Optional)

To quickly populate your database with sample courses for testing:

**Method 1: Using MongoDB Compass (Recommended)**

1. Download and install [MongoDB Compass](https://www.mongodb.com/products/compass)
2. Connect using your connection string:
   ```
   mongodb+srv://studysync_user:<password>@study-sync-cluster.xxxxx.mongodb.net/
   ```
3. Select `study-sync` database
4. Create a new collection named `courses`
5. Click **"Add Data"** → **"Import File"**
6. Select the `sample_courses.json` file from project root directory
7. Click **"Import"**

**Method 2: Using mongoimport (Command Line)**

```bash
# Navigate to project root directory
cd d:\Full Stack Projects\study-sync-ai

# Import sample courses
mongoimport --uri "mongodb+srv://studysync_user:<password>@study-sync-cluster.xxxxx.mongodb.net/study-sync" \
  --collection courses \
  --file sample_courses.json \
  --jsonArray
```

**What's Included in Sample Courses:**
- ✅ **GIT2025HINDI** - Complete Git and GitHub Tutorial (18 lessons, 169 mins)
- ✅ **REACT2025HINDI** - React.js Course by Chai aur Code (35 lessons, 1207 mins)
- ✅ **NODEJS2025HINDI** - Node.js Backend Development (Coming Soon)
- ✅ **PYTHONDATASCIENCE2025ENGLISH** - Python for Data Science by NPTEL (27 lessons, 597 mins)
- ✅ **DEVOPS2025HINDI** - Complete DevOps Course (20 lessons, 1144 mins)

**Note:** After importing, you can browse courses in your application and enroll in them for testing the complete workflow.

---

### ☁️ Step 4: Cloudinary Setup (For PDF Storage)

#### 4.1 Create Cloudinary Account

1. Go to [Cloudinary](https://cloudinary.com/)
2. Sign up for **FREE** account
3. Verify email

#### 4.2 Get API Credentials

1. Go to **Dashboard**
2. Copy the following:
   - **Cloud Name** (e.g., `your_cloud_name`)
   - **API Key** (e.g., `123456789012345`)
   - **API Secret** (e.g., `your_cloudinary_secret_key`)
3. Save these for AI service `.env` file

---

### 🔍 Step 5: Pinecone Setup (Optional - Vector Search)

Pinecone is used for advanced semantic search and vector embeddings. This is **optional** but recommended for enhanced search capabilities.

#### 5.1 Create Pinecone Account

1. Go to [Pinecone](https://www.pinecone.io/)
2. Sign up for **FREE** account (Starter plan)
3. Verify email

#### 5.2 Create Index

1. Go to **Indexes** in dashboard
2. Click **"Create Index"**
3. Index settings:
   - **Name**: `studysync-vectors` (or any name you prefer)
   - **Dimensions**: `1024` (for llama-text-embed-v2 model)
   - **Metric**: `cosine`
   - **Capacity Mode**: `Serverless`
   - **Cloud**: `AWS`
   - **Region**: `us-east-1` (or your preferred region)
4. Click **"Create Index"**

**Important:** The dimension must be `1024` to match the llama-text-embed-v2 embedding model used in this project.

#### 5.3 Get API Key

1. Go to **API Keys** in dashboard
2. Copy your API key
3. Save for `.env` file

#### 5.4 Configure in AI Service

The AI service will automatically use Pinecone if configured in `.env`:
```env
PINECONE_API_KEY=pcsk_your_api_key_here_32_characters
PINECONE_INDEX_NAME=studysync-vectors
```

**Configuration Notes:**
- Replace `pcsk_your_api_key_here_32_characters` with your actual Pinecone API key
- Ensure index name matches the one you created
- Vector embeddings will use **llama-text-embed-v2** model (1024 dimensions)
- If Pinecone is not configured, the system will work fine without vector search features

---

### 🤖 Step 6: Ollama Setup (Local AI)

#### 5.1 Install Ollama

**Windows:**
```bash
# Download from https://ollama.ai/download
# Run the installer
```

**Linux/Mac:**
```bash
curl -fsSL https://ollama.ai/install.sh | sh
```

#### 6.2 Pull Mistral Model (~5GB)

```bash
ollama pull mistral
```

#### 6.3 Verify Installation

```bash
ollama list
# Should show: mistral:latest
```

#### 6.4 Test Ollama

```bash
ollama run mistral "Hello, explain AI in one sentence"
```

**Note:** Ollama must keep running in background while using the AI service.

---

### 🐳 Step 7: Docker Setup (Kafka + Zookeeper)

#### 7.1 Install Docker Desktop

1. Download from [docker.com](https://www.docker.com/products/docker-desktop)
2. Install and start Docker Desktop
3. Verify installation:
   ```bash
   docker --version
   docker-compose --version
   ```

#### 7.2 Start Kafka & Zookeeper

```bash
# In project root directory
docker-compose up -d

# Verify containers are running
docker ps
# Should show: zookeeper and kafka containers
```

#### 7.3 Check Kafka Logs

```bash
docker logs kafka
# Should see: "Kafka Server started"
```

---

### 🔧 Step 8: Backend Setup

#### 8.1 Auth Service Configuration

```bash
cd backend/auth-service
npm install
```

**Create `.env` file:**

```env
# Server Configuration
PROD_PORT=3000
DEV_PORT=5000

# MongoDB Configuration
MONGO_DB_URI=mongodb+srv://your_username:YOUR_PASSWORD@your-cluster.xxxxx.mongodb.net/
MONGO_DB_NAME=study-sync

# Encryption Secret (for JWT tokens)
ENCRYPTION_SECRET=your_32_character_encryption_key_here

# Google API Key (Optional - for AI features)
GOOGLE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

# Kafka Configuration (default for local Docker)
KAFKA_BROKERS=localhost:9092

# Firebase Admin SDK
# Ensure you've placed the Firebase service account JSON file at:
# backend/auth-service/src/config/study-sync-ai-firebase-adminsdk.json
```

**⚠️ Important Notes:**
- Replace `YOUR_PASSWORD` with your actual MongoDB password
- Replace `xxxxx` with your cluster ID from MongoDB connection string
- Ensure Firebase JSON file is in the correct path
- Keep `.env` file secure (already in `.gitignore`)

**Start Auth Service:**

```bash
npm run start
# Server should start on: http://localhost:5000
```

#### 8.2 AI Service Configuration

```bash
cd backend/ai-service

# Create Python virtual environment
python -m venv myenv

# Activate virtual environment
# Windows (PowerShell):
myenv\Scripts\Activate.ps1
# Windows (CMD):
myenv\Scripts\activate.bat
# Linux/Mac:
source myenv/bin/activate

# Install dependencies (takes 5-10 minutes)
pip install -r requirements.txt
```

**Create `.env` file:**

```env
# MongoDB Configuration
MONGO_DB_URI=mongodb+srv://studysync_user:YOUR_PASSWORD@study-sync-cluster.xxxxx.mongodb.net/
MONGO_DB_NAME=study-sync

# Cloudinary Configuration (For PDF Storage)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=your_cloudinary_secret_key_here

# Pinecone Configuration (For Vector Search - Optional)
PINECONE_API_KEY=pcsk_your_api_key_here_32_characters
PINECONE_INDEX_NAME=studysync-vectors

# Google AI Configuration (Optional - Alternative to Ollama)
GOOGLE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

# Encryption
AES_ENCRYPTION_SECRET=your_32_character_secret_key
```

**⚠️ Important Notes:**
- Replace `YOUR_PASSWORD` with your actual MongoDB password
- Replace `xxxxx` with your cluster ID from MongoDB connection string
- Replace Cloudinary credentials with your actual values from dashboard
- Pinecone is **optional** - system works without it (dimensions must be 1024)
- Google API Key is **optional** - alternative to Ollama
- Generate AES_ENCRYPTION_SECRET: `node -e "console.log(require('crypto').randomBytes(16).toString('hex'))"`
- Ensure Firebase JSON file is at: `backend/ai-service/app/config/study-sync.json`
- Ollama must be running in background

**Start AI Service:**

```bash
# Make sure virtual environment is activated
uvicorn main:app --reload --host 0.0.0.0 --port 8000
# Server should start on: http://localhost:8000
```

#### 8.3 Certificate Service Configuration

```bash
cd backend/certificate-service
npm install
```

**Create `.env` file:**

```env
# Server Configuration
PORT=5001

# Cloudinary Configuration (For Certificate Storage)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=your_cloudinary_secret_key_here
```

**⚠️ Important Notes:**
- Replace Cloudinary credentials with your actual values from dashboard
- Port 5001 is used to avoid conflicts with auth service (5000)
- Puppeteer will be installed automatically for PDF generation
- Keep `.env` file secure (already in `.gitignore`)

**Start Certificate Service:**

```bash
npm start
# Server should start on: http://localhost:5001
```

**Test Certificate Generation:**

```bash
# Test certificate generation endpoint
curl "http://localhost:5001/generate-certificate?name=John%20Doe&course=React%20Fundamentals"

# List all certificates
curl "http://localhost:5001/list-certificates"
```

#### 8.4 Notification Service Configuration

```bash
cd backend/notification-service
npm install
```

**Create `.env` file (Optional):**

```env
# Note: This service uses hardcoded configuration in code
# .env file is optional but can be created for custom settings

# Server Configuration
PORT=3001

# Kafka Configuration (optional - defaults used in code)
KAFKA_BROKERS=localhost:9092
```

**Important:** Ensure Firebase Admin SDK JSON file is placed at:
- `backend/notification-service/config/study-sync-ai-1cbc2-firebase-adminsdk-fbsvc-74bc02dd8e.json`

**Start Notification Service:**

```bash
# Terminal 1: Start WebSocket server
npm run start

# Terminal 2: Start Kafka consumer
node kafka/notification_consumer.js
```

---

### 🎨 Step 9: Frontend Setup

```bash
cd frontend
npm install
```

**Create `.env` file:**

```env
# Firebase Client Configuration (from Step 2.4)
VITE_FIREBASE_API_KEY=your_firebase_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_PROJECT_ID=your-project-id
VITE_STORAGE_BUCKET=your-project-id.firebasestorage.app
VITE_MESSAGING_SENDER_ID=123456789012
VITE_APP_ID=1:123456789012:web:abcdef1234567890
VITE_MEASUREMENT_ID=G-XXXXXXXXXX

# Encryption Secret (generate random 32-character string)
# Generate using: node -e "console.log(require('crypto').randomBytes(16).toString('hex'))"
VITE_ENCRYPTION_SECRET=your_32_character_encryption_key_here
```

**Generate Encryption Secret:**

```bash
# Run this command to generate a random encryption key:
node -e "console.log(require('crypto').randomBytes(16).toString('hex'))"
# Copy the output and paste it as VITE_ENCRYPTION_SECRET value
```

**⚠️ Important Notes:**
- All Firebase values must match your Firebase project configuration from Step 2.4
- `VITE_FIREBASE_API_KEY`: Copy from Firebase Console
- `VITE_FIREBASE_AUTH_DOMAIN`: Usually `your-project-id.firebaseapp.com`
- `VITE_PROJECT_ID`: Your Firebase project ID
- `VITE_STORAGE_BUCKET`: Usually `your-project-id.firebasestorage.app`
- `VITE_MESSAGING_SENDER_ID`: Numeric ID from Firebase
- `VITE_APP_ID`: Starts with `1:` followed by your app identifier
- `VITE_MEASUREMENT_ID`: Google Analytics ID (starts with `G-`)
- `VITE_ENCRYPTION_SECRET`: Generate using the command above
- Don't use example values - replace with your actual Firebase config
- Keep all secrets secure (already in `.gitignore`)

**Start Frontend:**

```bash
npm run dev
# Frontend should start on: http://localhost:5173
```

---

### 🎯 Step 10: Quick Start (All Services)

**For Windows Users:**

```bash
# Simply double-click or run:
start_all.bat
```

This will automatically start:
1. Auth Service (Port 5000)
2. Certificate Service (Port 5001)
3. AI Service (Port 8000)
4. Frontend (Port 5173)
5. Notification Service (Port 3001)
6. Kafka + Zookeeper (Docker)
7. Kafka Consumer

**For Linux/Mac Users:**

Create `start_all.sh`:

```bash
#!/bin/bash

echo "Starting Auth Service..."
cd backend/auth-service && npm run start &

echo "Starting Certificate Service..."
cd backend/certificate-service && npm start &

echo "Starting AI Service..."
cd backend/ai-service && source myenv/bin/activate && uvicorn main:app --reload &

echo "Starting Frontend..."
cd frontend && npm run dev &

echo "Starting Notification Service..."
cd backend/notification-service && npm run start &

echo "Starting Kafka..."
docker-compose up -d

echo "Starting Kafka Consumer..."
cd backend/notification-service && node kafka/notification_consumer.js &

echo "All services started!"
```

```bash
chmod +x start_all.sh
./start_all.sh
```

---

### ✅ Step 11: Verify Installation

#### Check All Services:

1. **Auth Service:** [http://localhost:5000](http://localhost:5000)
2. **Certificate Service:** [http://localhost:5001](http://localhost:5001)
3. **AI Service:** [http://localhost:8000/docs](http://localhost:8000/docs) (FastAPI docs)
4. **Frontend:** [http://localhost:5173](http://localhost:5173)
5. **Notification Service:** [http://localhost:3001](http://localhost:3001)

#### Test Frontend Application:

1. Open [http://localhost:5173](http://localhost:5173) in browser
2. Sign up with Google/GitHub OAuth
3. Browse available courses (should see 5 sample courses if imported)
4. Enroll in a course (e.g., React or DevOps course)
5. Test video playback and AI chat features
6. Try PDF upload functionality
7. Generate quiz and check analytics

#### Test Ollama:

```bash
curl http://localhost:11434/api/tags
# Should return list of installed models including mistral
```

#### Check Kafka:

```bash
docker ps
# Both zookeeper and kafka containers should be running
```

#### Check MongoDB Connection:

```bash
# In auth-service or ai-service logs, you should see:
# ✅ Connected to MongoDB successfully!
```

#### Verify Sample Courses (If Imported):

```bash
# Using MongoDB Compass:
# 1. Connect to your database
# 2. Open 'study-sync' database
# 3. Check 'courses' collection
# 4. Should see 5 courses: GIT, REACT, NODEJS, PYTHON DATA SCIENCE, DEVOPS

# Or test via API:
curl http://localhost:5000/api/v1/courses/
# Should return array of courses with their details
```

---

### 🐛 Troubleshooting Common Issues

#### Issue 1: "Firebase Admin SDK not found"

**Solution:**
```bash
# Make sure Firebase JSON files are in correct locations:
ls backend/auth-service/src/config/study-sync-ai-firebase-adminsdk.json
ls backend/ai-service/app/config/study-sync.json
ls backend/notification-service/config/study-sync-ai-1cbc2-firebase-adminsdk-fbsvc-74bc02dd8e.json

# If missing, copy from downloaded Firebase service account key
```

#### Issue 2: "MongoDB connection failed"

**Solution:**
```bash
# 1. Check if MongoDB URI is correct in .env
# 2. Verify password doesn't contain special characters that need encoding
# 3. Check if IP is whitelisted (0.0.0.0/0 for development)
# 4. Test connection:
mongosh "mongodb+srv://studysync_user:PASSWORD@cluster.mongodb.net/"
```

#### Issue 3: "Ollama not responding"

**Solution:**
```bash
# 1. Check if Ollama is running:
ollama list

# 2. Restart Ollama:
# Windows: Restart Ollama Desktop
# Linux/Mac:
sudo systemctl restart ollama

# 3. Pull model again:
ollama pull mistral

# 4. Test connection:
curl http://localhost:11434/api/tags
```

#### Issue 4: "Kafka connection refused"

**Solution:**
```bash
# 1. Check Docker is running:
docker ps

# 2. Restart Kafka:
docker-compose down
docker-compose up -d

# 3. Check Kafka logs:
docker logs kafka

# 4. Wait 30 seconds for Kafka to fully start
```

#### Issue 5: "Port already in use"

**Solution:**
```bash
# Windows - Find and kill process:
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Linux/Mac:
lsof -ti:5000 | xargs kill -9
```

#### Issue 6: "Python virtual environment activation failed"

**Solution:**
```powershell
# Windows PowerShell - Enable script execution:
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Then activate:
myenv\Scripts\Activate.ps1

# If still failing, use CMD instead:
myenv\Scripts\activate.bat
```

#### Issue 7: "Cloudinary upload failed"

**Solution:**
```bash
# 1. Verify credentials in ai-service/.env
# 2. Test Cloudinary connection:
# Create test.py:
import cloudinary
cloudinary.config(
    cloud_name='your_cloud_name',
    api_key='your_api_key',
    api_secret='your_api_secret'
)
print("Cloudinary configured successfully!")

# Run: python test.py
```

#### Issue 8: "Firebase authentication failed in frontend"

**Solution:**
```javascript
// 1. Check frontend/.env has correct Firebase config
// 2. Verify Firebase authentication is enabled in Firebase Console
// 3. Clear browser cache and localStorage
localStorage.clear()
// 4. Restart frontend dev server
```

#### Issue 9: "TensorFlow model not loading"

**Solution:**
```bash
# AI service should have pre-trained TensorFlow models:
ls backend/ai-service/tensorflow_recommendation_model.h5
ls backend/ai-service/tensorflow_mlb_categories.joblib

# If missing, retrain the model:
cd backend/ai-service/model
python tensorflow_recommendation_model.py

# This will generate:
# - tensorflow_recommendation_model.h5 (Neural network weights)
# - tensorflow_mlb_categories.joblib (Label encoder)
```

#### Issue 10: "CORS errors in browser"

**Solution:**
```python
# Check ai-service/main.py has your frontend URL:
app.add_middleware(
    CORSMiddleware,
    allow_origins=['http://localhost:5173', 'http://127.0.0.1:5173'],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

#### Issue 11: "No courses visible in frontend"

**Solution:**
```bash
# 1. Check if courses collection exists in MongoDB:
# Using MongoDB Compass:
# - Connect to database
# - Look for 'courses' collection in 'study-sync' database

# 2. Import sample courses if missing:
cd d:\Full Stack Projects\study-sync-ai
mongoimport --uri "mongodb+srv://your_user:password@cluster.mongodb.net/study-sync" \
  --collection courses \
  --file sample_courses.json \
  --jsonArray

# 3. Verify courses via API:
curl http://localhost:5000/api/v1/courses/

# 4. Check browser console for API errors
# 5. Ensure auth service is running and database is connected
```

---

### 📋 Environment Variables Checklist

#### ✅ Frontend `.env` (8 variables required):
- [ ] `VITE_FIREBASE_API_KEY` (Required)
- [ ] `VITE_FIREBASE_AUTH_DOMAIN` (Required)
- [ ] `VITE_PROJECT_ID` (Required)
- [ ] `VITE_STORAGE_BUCKET` (Required)
- [ ] `VITE_MESSAGING_SENDER_ID` (Required)
- [ ] `VITE_APP_ID` (Required)
- [ ] `VITE_MEASUREMENT_ID` (Required)
- [ ] `VITE_ENCRYPTION_SECRET` (Required)

#### ✅ Auth Service `.env` (6 variables required):
- [ ] `PROD_PORT` (Required - default: 3000)
- [ ] `DEV_PORT` (Required - default: 5000)
- [ ] `MONGO_DB_URI` (Required)
- [ ] `MONGO_DB_NAME` (Required)
- [ ] `ENCRYPTION_SECRET` (Required - for JWT)
- [ ] `GOOGLE_API_KEY` (Optional)
- [ ] `KAFKA_BROKERS` (Optional - default: localhost:9092)

#### ✅ AI Service `.env` (8 variables minimum):
- [ ] `MONGO_DB_URI` (Required)
- [ ] `MONGO_DB_NAME` (Optional - defaults to value in connection string)
- [ ] `CLOUDINARY_CLOUD_NAME` (Required - for PDF storage)
- [ ] `CLOUDINARY_API_KEY` (Required)
- [ ] `CLOUDINARY_API_SECRET` (Required)
- [ ] `AES_ENCRYPTION_SECRET` (Required)
- [ ] `GOOGLE_API_KEY` (Optional - alternative to Ollama)
- [ ] `PINECONE_API_KEY` (Optional - for vector search with 1024 dimensions)
- [ ] `PINECONE_INDEX_NAME` (Optional - must match your Pinecone index name)

#### ✅ Notification Service `.env` (Optional):
- [ ] `PORT` (Optional - default: 3001)
- [ ] `KAFKA_BROKERS` (Optional - default: localhost:9092)

**Note:** Notification service works without .env file as it uses hardcoded defaults.

#### ✅ Notification Service `.env` (2 variables required):
- [ ] `PORT`
- [ ] `KAFKA_BROKERS`

#### ✅ Firebase JSON Files (3 locations):
- [ ] `backend/auth-service/src/config/study-sync-ai-firebase-adminsdk.json`
- [ ] `backend/ai-service/app/config/study-sync.json`
- [ ] `backend/notification-service/config/study-sync-ai-1cbc2-firebase-adminsdk-fbsvc-74bc02dd8e.json`

---

## � API Documentation

### � Authentication Service (Port 5000)

Base URL: `http://localhost:5000/api/v1`

#### User Management

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/user/create-user` | Create new user account | ✅ Firebase JWT |
| POST | `/user/signin` | Sign in user | ✅ Firebase JWT |
| GET | `/user/profile` | Get user profile | ✅ JWT Token |
| PUT | `/user/update-profile` | Update user info | ✅ JWT Token |

**Example: Create User**
```bash
curl -X POST http://localhost:5000/api/v1/user/create-user \
  -H "Authorization: Bearer YOUR_FIREBASE_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "email": "john@example.com",
    "displayName": "John Doe"
  }'
```

#### Course Management

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/courses/` | Get all available courses | ❌ |
| GET | `/courses/:courseId` | Get course playlist | ❌ |
| POST | `/courses/enroll-course` | Enroll in a course | ✅ JWT Token |
| GET | `/courses/get-enrolled-courses` | Get user's enrolled courses | ✅ JWT Token |
| POST | `/courses/change-course-progress` | Update course progress | ✅ JWT Token |
| POST | `/courses/get-current-course-progress` | Get current progress | ✅ JWT Token |
| POST | `/courses/track-playlist-index` | Track current video index | ✅ JWT Token |
| POST | `/courses/course-completed` | Mark course as completed | ✅ JWT Token |

**Example: Enroll in Course**
```bash
curl -X POST http://localhost:5000/api/v1/courses/enroll-course \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "courseId": "PYTHON2025ENG",
    "courseName": "Python Programming 2025"
  }'
```

**Example: Update Progress**
```bash
curl -X POST http://localhost:5000/api/v1/courses/change-course-progress \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "courseId": "PYTHON2025ENG",
    "videoId": "video123",
    "progress": 75,
    "isCompleted": false
  }'
```

#### Notes Management

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/notes/get-notes/:courseId` | Get course notes | ✅ JWT Token |
| POST | `/notes/save-notes` | Save/Update notes | ✅ JWT Token |
| DELETE | `/notes/delete-notes/:courseId` | Delete course notes | ✅ JWT Token |

**Example: Save Notes**
```bash
curl -X POST http://localhost:5000/api/v1/notes/save-notes \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "courseId": "PYTHON2025ENG",
    "notes": "# Python Basics\n\n## Variables\n- Integer: `x = 5`\n- String: `name = \"John\"`"
  }'
```

#### Dashboard & Analytics

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/dashboard/performance` | Get overall performance | ✅ JWT Token |
| GET | `/dashboard/topic-wise` | Get topic-wise analytics | ✅ JWT Token |
| GET | `/dashboard/trend-analysis` | Get learning trends | ✅ JWT Token |
| GET | `/dashboard/quiz-performance` | Get quiz performance | ✅ JWT Token |
| GET | `/dashboard/user-activities` | Get recent activities | ✅ JWT Token |

#### Admin Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/admin/create-course` | Create new course | ✅ Admin JWT |
| PUT | `/admin/update-course/:courseId` | Update course | ✅ Admin JWT |
| DELETE | `/admin/delete-course/:courseId` | Delete course | ✅ Admin JWT |
| GET | `/admin/all-users` | Get all users | ✅ Admin JWT |
| GET | `/admin/analytics` | Get platform analytics | ✅ Admin JWT |

#### Certificate Management

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/certificate/get-user-certificates` | Get user certificates | ✅ JWT Token |

**Example: Get User Certificates**
```bash
curl -X GET http://localhost:5000/api/v1/certificate/get-user-certificates \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json"
```

**Response:**
```json
{
  "statusCode": 200,
  "data": {
    "certificates": [
      {
        "_id": "68eb82b93c9a70b9558fe3ba",
        "certificateUrl": "https://res.cloudinary.com/dmijbupsf/raw/upload/v1760264888/study-sync-certificates/certificates/Navnath_Kadam_Python_Full_Course.pdf",
        "courseName": "Python Full Course - Beginner to Advanced",
        "issueDate": "12/10/2025",
        "fileName": "Navnath Kadam_Python Full Course - Beginner to Advanced_certificate.pdf",
        "publicId": "study-sync-certificates/certificates/Navnath_Kadam_Python_Full_Course.pdf",
        "certificateLoadType": "done"
      }
    ]
  },
  "message": "User certificates fetched successfully",
  "success": true
}
```

---

### 🏆 Certificate Service (Port 5001)

Base URL: `http://localhost:5001`

#### Certificate Generation

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/generate-certificate` | Generate and upload certificate | ❌ |
| GET | `/get-certificate/:publicId` | Get certificate by public ID | ❌ |
| GET | `/list-certificates` | List all certificates | ❌ |
| DELETE | `/delete-certificate/:publicId` | Delete certificate | ❌ |

**Example: Generate Certificate**
```bash
curl "http://localhost:5001/generate-certificate?name=John%20Doe&course=React%20Fundamentals"
```

**Response:**
```json
{
  "success": true,
  "message": "Certificate generated and uploaded successfully",
  "certificateUrl": "https://res.cloudinary.com/dmijbupsf/raw/upload/v1760264888/study-sync-certificates/certificates/John_Doe_React_Fundamentals_1760264886811.pdf",
  "publicId": "study-sync-certificates/certificates/John_Doe_React_Fundamentals_1760264886811.pdf",
  "courseName": "React Fundamentals",
  "studentName": "John Doe",
  "issueDate": "12/10/2025",
  "fileName": "John Doe_React Fundamentals_certificate.pdf"
}
```

**Example: List All Certificates**
```bash
curl "http://localhost:5001/list-certificates"
```

**Response:**
```json
{
  "success": true,
  "count": 3,
  "certificates": [
    {
      "publicId": "study-sync-certificates/certificates/John_Doe_React_Fundamentals_1760264886811.pdf",
      "url": "https://res.cloudinary.com/dmijbupsf/raw/upload/v1760264888/study-sync-certificates/certificates/John_Doe_React_Fundamentals_1760264886811.pdf",
      "fileName": "John_Doe_React_Fundamentals_1760264886811.pdf",
      "uploadedAt": "2025-01-15T10:30:00.000Z",
      "fileSize": 125648
    }
  ]
}
```

**Example: Get Certificate by Public ID**
```bash
curl "http://localhost:5001/get-certificate/certificates/John_Doe_React_Fundamentals_1760264886811"
```

**Example: Delete Certificate**
```bash
curl -X DELETE "http://localhost:5001/delete-certificate/certificates/John_Doe_React_Fundamentals_1760264886811"
```

---

### � AI Service (Port 8000)

Base URL: `http://localhost:8000/api/v1`

Interactive API Documentation: `http://localhost:8000/docs` (FastAPI Swagger UI)

#### Video Transcript

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/transcripts/get-transcript` | Extract video transcript | ✅ JWT Token |

**Example:**
```bash
curl -X POST http://localhost:8000/api/v1/transcripts/get-transcript \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "videoId": "dQw4w9WgXcQ",
    "courseId": "PYTHON2025ENG"
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "transcript": "Welcome to Python programming...",
    "duration": "15:30",
    "language": "en"
  }
}
```

#### AI Summaries

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/summaries/get-summary` | Generate content summary | ✅ JWT Token |
| POST | `/summaries/video-summary` | Get video summary | ✅ JWT Token |
| POST | `/summaries/course-summary` | Get course overview | ✅ JWT Token |

**Example: Video Summary**
```bash
curl -X POST http://localhost:8000/api/v1/summaries/video-summary \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "videoId": "dQw4w9WgXcQ",
    "courseId": "PYTHON2025ENG",
    "transcript": "Full video transcript here..."
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "summary": "• Python is a high-level programming language\n• Variables store data\n• Functions organize code\n...",
    "keyPoints": 5,
    "estimatedReadTime": "2 minutes"
  }
}
```

#### AI Chat

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/chat/send-chat` | Send chat message | ✅ JWT Token |
| GET | `/chat/fetch-chats` | Get chat history | ✅ JWT Token |
| DELETE | `/chat/clear-chat/:courseId` | Clear course chat | ✅ JWT Token |

**Example: Send Chat**
```bash
curl -X POST http://localhost:8000/api/v1/chat/send-chat \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "courseId": "PYTHON2025ENG",
    "videoId": "video123",
    "prompt": "Explain what is a list in Python with examples",
    "context": "Previous transcript or course content..."
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "response": "A list in Python is a collection of items that can hold multiple values. Here's an example:\n\n```python\nfruits = ['apple', 'banana', 'orange']\nprint(fruits[0])  # Output: apple\n```",
    "chatId": "chat_abc123",
    "timestamp": "2025-01-15T10:30:00Z"
  }
}
```

#### PDF Processing

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/pdf/upload-pdf` | Upload PDF file | ✅ JWT Token |
| POST | `/pdf/get-pdf-summary` | Get PDF summary | ✅ JWT Token |
| POST | `/pdf/send-pdf-chat` | Chat about PDF content | ✅ JWT Token |
| GET | `/pdf/get-pdf-chats/:pdfId` | Get PDF chat history | ✅ JWT Token |
| GET | `/pdf/get-pdf-metadata/:pdfId` | Get PDF metadata | ✅ JWT Token |

**Example: Upload PDF**
```bash
curl -X POST http://localhost:8000/api/v1/pdf/upload-pdf \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "file=@/path/to/document.pdf" \
  -F "courseId=PYTHON2025ENG"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "pdfId": "pdf_xyz789",
    "filename": "document.pdf",
    "cloudinaryUrl": "https://res.cloudinary.com/...",
    "pages": 25,
    "uploadedAt": "2025-01-15T10:30:00Z"
  }
}
```

#### Quiz Generation

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/quiz/generate-quiz` | Generate quiz from content | ✅ JWT Token |
| POST | `/quiz/submit-quiz` | Submit quiz answers | ✅ JWT Token |
| GET | `/quiz/quiz-history/:courseId` | Get quiz history | ✅ JWT Token |

**Example: Generate Quiz**
```bash
curl -X POST http://localhost:8000/api/v1/quiz/generate-quiz \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "courseId": "PYTHON2025ENG",
    "videoId": "video123",
    "content": "Python lists are mutable, ordered collections...",
    "numQuestions": 5,
    "difficulty": "medium"
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "quizId": "quiz_123",
    "questions": [
      {
        "id": 1,
        "question": "What is a Python list?",
        "options": [
          "A mutable collection",
          "An immutable collection",
          "A single value",
          "A function"
        ],
        "correctAnswer": 0
      }
    ]
  }
}
```

#### ML Recommendations

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/recommend/courses` | Get recommended courses | ✅ JWT Token |
| GET | `/recommend/similar/:courseId` | Get similar courses | ✅ JWT Token |

**Example: Get Recommendations**
```bash
curl -X GET http://localhost:8000/api/v1/recommend/courses \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "recommendations": [
      {
        "courseId": "AIML2025ENG",
        "courseName": "AI & Machine Learning",
        "score": 0.87,
        "reason": "Based on your Python progress and interest in programming",
        "category": "AI/ML"
      },
      {
        "courseId": "PYTHONDATASCIENCE2025ENGLISH",
        "courseName": "Python for Data Science",
        "score": 0.82,
        "reason": "Complements your Python knowledge",
        "category": "DATA SCIENCE"
      }
    ],
    "modelUsed": "tensorflow"
  }
}
```

---

### 🔔 Notification Service (Port 3001)

#### WebSocket Events

**Connect to WebSocket:**
```javascript
import io from 'socket.io-client';

const socket = io('http://localhost:3001', {
  auth: {
    token: 'YOUR_JWT_TOKEN'
  }
});

// Listen for notifications
socket.on('notification', (data) => {
  console.log('New notification:', data);
});
```

**Event Types:**
- `notification` - General notifications
- `course_update` - Course content updates
- `progress_milestone` - Learning milestones
- `quiz_completed` - Quiz completion
- `enrollment_confirmed` - Course enrollment

---

## 🧪 Sample Workflows

### Workflow 1: Complete Learning Flow

```javascript
// 1. User signs in
const authResponse = await firebase.auth().signInWithPopup(googleProvider);
const idToken = await authResponse.user.getIdToken();

// 2. Create user in backend
await axios.post('/api/v1/user/create-user', {
  username: 'johndoe'
}, {
  headers: { Authorization: `Bearer ${idToken}` }
});

// 3. Get all courses
const courses = await axios.get('/api/v1/courses/');

// 4. Enroll in a course
await axios.post('/api/v1/courses/enroll-course', {
  courseId: 'PYTHON2025ENG'
}, {
  headers: { Authorization: `Bearer ${token}` }
});

// 5. Get video transcript
const transcript = await axios.post('/api/v1/transcripts/get-transcript', {
  videoId: 'videoXYZ',
  courseId: 'PYTHON2025ENG'
});

// 6. Get AI summary
const summary = await axios.post('/api/v1/summaries/video-summary', {
  videoId: 'videoXYZ',
  transcript: transcript.data
});

// 7. Ask AI a question
const aiResponse = await axios.post('/api/v1/chat/send-chat', {
  courseId: 'PYTHON2025ENG',
  prompt: 'What are Python decorators?',
  context: transcript.data
});

// 8. Save notes
await axios.post('/api/v1/notes/save-notes', {
  courseId: 'PYTHON2025ENG',
  notes: '# My Python Notes\n\n## Decorators...'
});

// 9. Generate quiz
const quiz = await axios.post('/api/v1/quiz/generate-quiz', {
  courseId: 'PYTHON2025ENG',
  content: transcript.data,
  numQuestions: 5
});

// 10. Update progress
await axios.post('/api/v1/courses/change-course-progress', {
  courseId: 'PYTHON2025ENG',
  videoId: 'videoXYZ',
  progress: 100,
  isCompleted: true
});

// 11. Get recommendations
const recommendations = await axios.get('/api/v1/recommend/courses');
```

### Workflow 2: PDF Learning Flow

```javascript
// 1. Upload PDF
const formData = new FormData();
formData.append('file', pdfFile);
formData.append('courseId', 'PYTHON2025ENG');

const uploadResponse = await axios.post('/api/v1/pdf/upload-pdf', formData, {
  headers: {
    'Content-Type': 'multipart/form-data',
    Authorization: `Bearer ${token}`
  }
});

const pdfId = uploadResponse.data.pdfId;

// 2. Get PDF summary
const summary = await axios.post('/api/v1/pdf/get-pdf-summary', {
  pdfId: pdfId
});

// 3. Chat about PDF
const chatResponse = await axios.post('/api/v1/pdf/send-pdf-chat', {
  pdfId: pdfId,
  prompt: 'Summarize chapter 3'
});

// 4. Get PDF metadata
const metadata = await axios.get(`/api/v1/pdf/get-pdf-metadata/${pdfId}`);
```

---

## 🏗️ Machine Learning Models

### TensorFlow Recommendation System

The platform uses a custom-built **TensorFlow neural network** for intelligent course recommendations.

**Model Architecture:**
```python
Input Layer: (n_courses * 2) features
  ↓
Dense Layer 1: 128 neurons (ReLU) + BatchNormalization + Dropout(0.3)
  ↓
Dense Layer 2: 64 neurons (ReLU) + BatchNormalization + Dropout(0.3)
  ↓
Dense Layer 3: 32 neurons (ReLU)
  ↓
Output Layer: 9 categories (Sigmoid - Multi-label)
```

**Features Used:**
- Course progress (0-100%)
- Quiz scores (0-100%)
- Interaction patterns
- Category preferences

**Supported Categories:**
1. PROGRAMMING
2. GIT AND GITHUB
3. AI/ML
4. DESIGN
5. LANGUAGES
6. MOBILE
7. DEVELOPMENT
8. DATA SCIENCE
9. DEVOPS

**Supported Courses:**
- PYTHON2025ENG
- GIT2025ENG
- AIML2025ENG
- UIUXHINDI
- PYTHON2025HINDI
- FLUTTER2025EN
- GIT2025HINDI
- REACT2025HINDI
- NODEJS2025HINDI
- PYTHONDATASCIENCE2025ENGLISH
- DEVOPS2025HINDI

**Model Training:**
```bash
cd backend/ai-service/model
python tensorflow_recommendation_model.py
```

**Model Performance:**
- Training accuracy: ~85-90%
- Multi-label prediction across 9 categories
- Real-time inference with optimized TensorFlow serving
- Model size: ~2.5MB (lightweight and fast)

**Note:** Random Forest model was used during testing phase for comparison but the production system uses TensorFlow exclusively for better accuracy and scalability.

---

## 🎨 Frontend Features

### State Management (Zustand)

```javascript
// Store Slices:
- useUserStore: User authentication & profile
- useIsAuth: Authentication state
- useCurrentPlaylist: Current video playback
- useNotes: Notes management
- useLoaders: Loading states
- useNotifications: Notification management
- useThemeStore: Dark/Light theme
```

### Key Components

**Protected Routes:**
- `ProtectedLayout.jsx` - User authentication guard
- `ProtectedAdminLayout.jsx` - Admin role guard

**Pages:**
- `Home.jsx` - Landing page with features
- `Courses.jsx` - Browse all courses
- `Dashboard.jsx` - User learning dashboard
- `VideoInteraction.jsx` - Video player with AI chat
- `PdfInteraction.jsx` - PDF viewer with AI assistant
- `AdminDashboard.jsx` - Platform analytics

**API Integration:**
- 25+ API utility modules
- Centralized error handling
- Automatic token refresh
- Request interceptors

### Charts & Visualization

- **Chart.js** - Quiz performance, progress tracking
- **Recharts** - Trend analysis, topic-wise analytics
- **Custom Dashboards** - Real-time learning insights

---

## 🔒 Security Features

### Authentication Flow

```
1. User signs in with Firebase (Google/GitHub OAuth)
2. Frontend receives Firebase JWT token
3. Backend verifies Firebase token with Admin SDK
4. Backend generates custom JWT token
5. Frontend stores token (encrypted with crypto-js)
6. All API requests include JWT in Authorization header
7. Backend middleware verifies JWT before processing
```

### Security Measures

- ✅ **Firebase Authentication** - Industry-standard OAuth
- ✅ **JWT Tokens** - Secure API authentication
- ✅ **Token Encryption** - Frontend token storage encrypted
- ✅ **CORS Protection** - Whitelisted origins only
- ✅ **Rate Limiting** - Prevent API abuse (TODO)
- ✅ **Input Validation** - Prevent injection attacks
- ✅ **Firebase Admin SDK** - Server-side token verification
- ✅ **Environment Variables** - Sensitive data protection
- ✅ **HTTPS Ready** - SSL/TLS support

---

## 🐳 Docker Deployment

### Docker Compose Setup

The project uses Docker for **Kafka** and **Zookeeper**:

```yaml
services:
  zookeeper:
    image: confluentinc/cp-zookeeper:7.4.0
    ports:
      - "2181:2181"
    environment:
      ZOOKEEPER_CLIENT_PORT: 2181
      ZOOKEEPER_TICK_TIME: 2000

  kafka:
    image: confluentinc/cp-kafka:7.4.0
    depends_on:
      - zookeeper
    ports:
      - "9092:9092"
    environment:
      KAFKA_BROKER_ID: 1
      KAFKA_ZOOKEEPER_CONNECT: zookeeper:2181
      KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://localhost:9092
```

**Start Services:**
```bash
docker-compose up -d
```

**Stop Services:**
```bash
docker-compose down
```

### Full Dockerization (Future)

```dockerfile
# Example: AI Service Dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

---

## 📊 Database Schema

### MongoDB Collections

#### Users Collection
```javascript
{
  _id: ObjectId,
  firebaseUid: String,
  username: String,
  email: String,
  displayName: String,
  photoURL: String,
  role: String, // 'user' | 'admin'
  createdAt: Date,
  updatedAt: Date
}
```

#### Courses Collection
```javascript
{
  _id: ObjectId,
  courseId: String, // Unique identifier
  courseName: String,
  description: String,
  category: String,
  language: String, // 'en' | 'hi'
  instructor: String,
  thumbnail: String,
  playlist: [
    {
      videoId: String,
      title: String,
      duration: String,
      order: Number
    }
  ],
  totalVideos: Number,
  level: String, // 'beginner' | 'intermediate' | 'advanced'
  createdAt: Date
}
```

#### Enrollments Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  courseId: String,
  enrolledAt: Date,
  progress: Number, // 0-100
  currentVideoIndex: Number,
  completedVideos: [String], // Array of videoIds
  lastAccessedAt: Date,
  isCompleted: Boolean,
  completedAt: Date
}
```

#### Notes Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  courseId: String,
  notes: String, // Markdown content
  lastUpdated: Date
}
```

#### Chats Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  courseId: String,
  videoId: String,
  messages: [
    {
      role: String, // 'user' | 'assistant'
      content: String,
      timestamp: Date
    }
  ],
  createdAt: Date
}
```

#### Quizzes Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  courseId: String,
  videoId: String,
  questions: [
    {
      question: String,
      options: [String],
      correctAnswer: Number,
      userAnswer: Number
    }
  ],
  score: Number,
  totalQuestions: Number,
  submittedAt: Date
}
```

#### PDFs Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  courseId: String,
  filename: String,
  cloudinaryUrl: String,
  cloudinaryPublicId: String,
  pages: Number,
  summary: String,
  uploadedAt: Date
}
```

---

## 🧪 Testing

### Running Tests

```bash
# Backend - Auth Service
cd backend/auth-service
npm test

# Backend - AI Service
cd backend/ai-service
python -m pytest

# Frontend
cd frontend
npm test
```

### Test Coverage

- Unit tests for controllers
- Integration tests for APIs
- E2E tests for critical flows (TODO)

### Manual Testing

**Test Recommendation System:**
```bash
cd backend/ai-service
python test_recommendations.py
```

**Test TensorFlow Model:**
```bash
cd backend/ai-service
python test_tensorflow_model.py
```

**Test Normalization:**
```bash
cd backend/ai-service
python test_normalization.py
```

---

## 📈 Performance Optimization

### Frontend Optimization
- ✅ **CSS Animations** - Hardware-accelerated transitions for smooth UI
- ✅ **Conditional Rendering** - Dynamic component loading based on state
- ✅ **Loader States** - Skeleton screens for better perceived performance
- ✅ **Optimized Re-renders** - Component state management with Zustand
- ✅ **Image Lazy Loading** - Native `loading="lazy"` attribute usage

### Backend Optimization
- ✅ **MongoDB Indexing** - Compound indexes on `userId + courseId` for enrollments
- ✅ **Async Operations** - FastAPI async/await patterns for I/O operations
- ✅ **CORS Configuration** - Optimized middleware for cross-origin requests
- ✅ **Connection Pooling** - MongoDB Motor driver with built-in pooling
- ✅ **Error Handling** - Centralized error management with ApiError class

### AI Model Optimization
- ✅ **TensorFlow Model** - Pre-trained neural network (1024D embeddings)
- ✅ **Ollama Local LLM** - Mistral model for faster inference
- ✅ **Batch Processing** - Group operations for quiz generation
- ✅ **Pinecone Vector Search** - Efficient similarity search with cosine metric

---

## 🚀 Deployment Guide

### Production Environment Setup

#### 1. Environment Variables (Production)

**Frontend (.env.production):**
```env
VITE_FIREBASE_API_KEY=production_api_key
VITE_AUTH_SERVICE_URL=https://api.studysync.com
VITE_AI_SERVICE_URL=https://ai.studysync.com
VITE_NOTIFICATION_URL=https://notify.studysync.com
```

**Backend Services:**
- Use environment-specific .env files
- Store secrets in secure vaults (AWS Secrets Manager, etc.)
- Enable HTTPS/SSL
- Configure CORS for production domains

#### 2. Build for Production

```bash
# Frontend
cd frontend
npm run build
# Output: dist/ folder

# Backend services are ready as-is
```

#### 3. Server Setup (Example: AWS EC2)

```bash
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install Python
sudo apt-get install python3.11 python3.11-venv

# Install Docker
sudo apt-get install docker.io docker-compose

# Install Nginx
sudo apt-get install nginx

# Install PM2 (Process Manager)
sudo npm install -g pm2
```

#### 4. Nginx Configuration

```nginx
# /etc/nginx/sites-available/studysync

server {
    listen 80;
    server_name studysync.com www.studysync.com;

    # Frontend
    location / {
        root /var/www/studysync/frontend/dist;
        try_files $uri $uri/ /index.html;
    }

    # Auth Service API
    location /api/v1/user/ {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # AI Service API
    location /api/v1/chat/ {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
    }

    # WebSocket
    location /socket.io/ {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

#### 5. SSL Certificate (Let's Encrypt)

```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d studysync.com -d www.studysync.com
```

#### 6. Start Services with PM2

```bash
# Auth Service
cd backend/auth-service
pm2 start src/index.js --name auth-service

# AI Service
cd backend/ai-service
pm2 start "uvicorn main:app --host 0.0.0.0 --port 8000" --name ai-service

# Notification Service
cd backend/notification-service
pm2 start app/index.js --name notification-service
pm2 start kafka/notification_consumer.js --name kafka-consumer

# Save PM2 configuration
pm2 save
pm2 startup
```

#### 7. Monitoring

```bash
# View logs
pm2 logs

# Monitor resources
pm2 monit

# Restart service
pm2 restart auth-service
```

---

## 🔮 Future Enhancements

### Phase 1 (Short-term)
- [ ] **Voice Chat** - Speech-to-text AI interaction
- [ ] **Mobile App** - React Native application
- [ ] **Redis Caching** - Faster API responses
- [ ] **Rate Limiting** - API abuse prevention
- [ ] **Email Notifications** - Course updates via email
- [ ] **Advanced Search** - Semantic search across courses
- [ ] **Bookmarks** - Save important video timestamps

### Phase 2 (Mid-term)
- [ ] **Live Classes** - Real-time video streaming
- [ ] **Peer Discussion** - Student forums
- [ ] **Certificates** - Course completion certificates
- [ ] **Payment Integration** - Premium courses
- [ ] **Video Upload** - Instructor course creation
- [ ] **Gamification** - Badges, streaks, leaderboards
- [ ] **Multi-language** - Support more languages

### Phase 3 (Long-term)
- [ ] **Mobile Apps** - iOS & Android native apps
- [ ] **AI Tutor** - Personalized learning assistant
- [ ] **AR/VR Integration** - Immersive learning
- [ ] **Blockchain Certificates** - Verifiable credentials
- [ ] **Social Learning** - Study groups, mentorship
- [ ] **Advanced Analytics** - Predictive learning paths
- [ ] **API Marketplace** - Third-party integrations

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### Contribution Guidelines

1. **Fork the Repository**
   ```bash
   git fork https://github.com/ndk123-web/study-sync-ai.git
   ```

2. **Create Feature Branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

3. **Make Changes**
   - Write clean, documented code
   - Follow existing code style
   - Add tests if applicable

4. **Commit Changes**
   ```bash
   git commit -m 'Add: Amazing new feature'
   ```

5. **Push to Branch**
   ```bash
   git push origin feature/amazing-feature
   ```

6. **Open Pull Request**
   - Describe your changes
   - Reference related issues
   - Wait for review

### Code Style

**JavaScript/React:**
- ESLint configuration provided
- Use meaningful variable names
- Comment complex logic

**Python:**
- Follow PEP 8 guidelines
- Use type hints where applicable
- Document functions with docstrings

### Areas to Contribute

- 🐛 **Bug Fixes** - Report and fix bugs
- ✨ **Features** - Implement new features
- 📚 **Documentation** - Improve docs
- 🎨 **UI/UX** - Enhance user interface
- 🧪 **Testing** - Write more tests
- 🌐 **Translations** - Add language support

---

## 🐛 Known Issues & Limitations

### Current Limitations

1. **Ollama Dependency** - Requires local Ollama installation (5GB+ model)
2. **Single Language** - UI primarily in English
3. **PDF Size Limit** - Max 10MB per PDF upload
4. **Video Platform** - Only YouTube videos supported
5. **Concurrent Users** - Not optimized for high concurrency yet
6. **Mobile Experience** - Desktop-first design

### Planned Fixes

- Switch to cloud-based AI (Google Gemini) for scalability
- Add multi-language UI support
- Increase PDF size limit with chunking
- Support Vimeo, Coursera, Udemy videos
- Implement horizontal scaling
- Responsive mobile-first redesign

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2025 Navnath Devkar & Sahil Khilari

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
```

---

## 👥 Authors & Contributors

### Project Team

**Navnath Kadam** | [@ndk123-web](https://github.com/ndk123-web) - **Project Lead**
- 🎓 Computer Engineering Student
- 💼 Full Stack Developer & ML Engineer
- 🔭 Backend Architecture, AI Integration, TensorFlow Models, Database Design
- 🌐 Portfolio: [ndkdev.me](https://ndkdev.me)
- 📧 Email: navnathkadam284@gmail.com

**Sahil Khilari** | [@sahil-khilari](https://github.com/sahil-khilari)
- 🎓 Computer Engineering Student
- 💼 Team Member
- 📧 Email: khilarisahil786@gmail.com

**Prathmesh Nitnaware** | [Prathmesh Nitnaware](https://github.com/prathmesh-nitnaware)
- 🎓 Computer Engineering Student
- 💼 Team Member
- 📧 Email: nitnaware.prathmesh@gmail.com

**Sneha Chavan** | [Sneha Chavan](nitnaware.prathmesh@gmail.com)
- 🎓 Computer Engineering Student
- � Team Member
- 📧 Email: snehachavan172005@gmail.com

### Special Thanks

- **Google Gemini Team** - For AI API documentation
- **Ollama Community** - For local AI models
- **Firebase Team** - For authentication services
- **MongoDB Team** - For excellent database platform
- **Open Source Community** - For amazing tools and libraries
- **Pinecone Team** - For vector search

---

## 📞 Support & Contact

### Get Help

- 📖 **Documentation**: This README
- 🐛 **Bug Reports**: [GitHub Issues](https://github.com/ndk123-web/study-sync-ai/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/ndk123-web/study-sync-ai/discussions)
- 📧 **Email**: navnathkadam284@gmail.com

### Community

- 🌟 **Star this repo** if you find it helpful!
- 🔗 **Share** with fellow developers
- 🤝 **Contribute** to make it better

---

## 🙏 Acknowledgments

### Technologies & Services

- **[React](https://reactjs.org/)** - Frontend framework
- **[FastAPI](https://fastapi.tiangolo.com/)** - Python web framework
- **[Express.js](https://expressjs.com/)** - Node.js framework
- **[TensorFlow](https://www.tensorflow.org/)** - Machine learning
- **[Ollama](https://ollama.ai/)** - Local AI models
- **[Firebase](https://firebase.google.com/)** - Authentication
- **[MongoDB Atlas](https://www.mongodb.com/atlas)** - Database
- **[Cloudinary](https://cloudinary.com/)** - Media storage
- **[Apache Kafka](https://kafka.apache.org/)** - Event streaming
- **[Tailwind CSS](https://tailwindcss.com/)** - Styling
- **[Vite](https://vitejs.dev/)** - Build tool
- **[Pinecone](https://www.pinecone.io/)** - Remote Vector DB Service

### Inspiration

This project was inspired by the need for an intelligent, accessible learning platform that combines the power of AI with modern web technologies to enhance the learning experience for students worldwide.

---

## 📊 Project Stats

- **Lines of Code**: 50,000+
- **API Endpoints**: 30+
- **Database Collections**: 7
- **Supported Courses**: 11 (in future it will be more)
- **ML Model**: TensorFlow Neural Network (3-layer architecture)
- **Dependencies**: 200+
- **Development Time**: 2 months
- **Contributors**: 4

---

## 🎯 Project Goals

### Mission
To democratize education by making high-quality learning resources accessible, interactive, and personalized through AI technology.

### Vision
Become the leading AI-powered learning platform that adapts to each student's unique learning style and pace.

### Core Values
- 🎓 **Education First** - Learning experience above everything
- 🤖 **AI-Powered** - Leverage AI to enhance learning
- 🔓 **Open Source** - Transparent and collaborative
- 🚀 **Innovation** - Constantly improving and evolving
- 🌍 **Accessibility** - Learning for everyone, everywhere

---

<div align="center">

### ⭐ Star History

[![Star History Chart](https://api.star-history.com/svg?repos=ndk123-web/study-sync-ai&type=Date)](https://star-history.com/#ndk123-web/study-sync-ai&Date)

---

**Made with ❤️ by [Navnath Kadam](https://github.com/ndk123-web)**

**If you find this project useful, please consider giving it a ⭐!**

[⬆ Back to Top](#-studysync-ai---intelligent-learning-platform)

</div>