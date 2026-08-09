# 🍽️ NutriSnap AI — AI Food & Nutrition Analyzer

**Snap Your Food. Understand Your Nutrition.** A full-stack AI-powered food recognition, nutrition analysis, and health coaching platform fine-tuned for Indian & Global regional cuisine.

---

## 🏗️ Architecture & Communication Flow

```
                               ┌─────────────────────────┐
                               │     User Web Browser    │
                               └────────────┬────────────┘
                                            │
                                            ▼
                               ┌─────────────────────────┐
                               │   React SaaS Frontend   │
                               │  (Render Static Site)   │
                               └────────────┬────────────┘
                                            │
                           HTTP Requests (REACT_APP_BACKEND_URL)
                                            │
                                            ▼
                               ┌─────────────────────────┐
                               │   Spring Boot Backend   │
                               │  (Render Web Service)   │
                               └────────────┬────────────┘
                                            │
                          HTTP API Requests (FLASK_AI_URL)
                                            │
                                            ▼
                               ┌─────────────────────────┐
                               │    Python AI Service    │
                               │  (Render Web Service)   │
                               └────────────┬────────────┘
                                            │
                       ┌────────────────────┴────────────────────┐
                       │                                         │
                       ▼                                         ▼
         ┌───────────────────────────┐             ┌───────────────────────────┐
         │   Gemini 1.5 Vision API   │             │   HuggingFace CLIP /      │
         │   & AI Coach Agent API    │             │  Feature Match Engine     │
         └───────────────────────────┘             └───────────────────────────┘
```

---

## 🚀 Render Cloud Deployment Guide

Follow these exact steps to host the complete application on [Render](https://render.com).

Repository URL: `https://github.com/YASH-RAJBHAR/food-analyzer-project`

---

### Step 1: Deploy Python AI Service (`ai-service`)

1. Go to your **Render Dashboard** $\rightarrow$ Click **New +** $\rightarrow$ Select **Web Service**.
2. Connect your GitHub repository (`food-analyzer-project`).
3. Configure the service settings:
   - **Name**: `food-analyzer-ai-service`
   - **Region**: Oregon (US West) or closest region
   - **Root Directory**: `ai-service` *(Must be the folder name `ai-service`)*
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn --bind 0.0.0.0:$PORT app:app`
4. Add **Environment Variables**:
   - `PORT`: `5001`
   - `GEMINI_API_KEY`: *(Optional: Your Gemini Vision API key)*
5. Click **Create Web Service**.
6. Copy the deployed service URL (e.g. `https://food-analyzer-ai-service.onrender.com`).

---

### Step 2: Deploy Spring Boot Backend (`backend`)

1. Go to your **Render Dashboard** $\rightarrow$ Click **New +** $\rightarrow$ Select **Web Service**.
2. Connect your GitHub repository (`food-analyzer-project`).
3. Configure the service settings:
   - **Name**: `food-analyzer-backend`
   - **Region**: Same region as AI Service
   - **Root Directory**: `backend`
   - **Runtime**: `Java` (or `Docker` / `Environment Native`)
   - **Build Command**: `./mvnw clean package -DskipTests`
   - **Start Command**: `java -jar target/food-analyzer-backend-0.0.1-SNAPSHOT.jar`
4. Add **Environment Variables**:
   - `PORT`: `8080`
   - `FLASK_AI_URL`: `https://food-analyzer-ai-service.onrender.com/predict` *(Use your deployed AI Service URL + `/predict`)*
   - `CORS_ALLOWED_ORIGINS`: `*` *(Or your deployed Frontend URL once created)*
   - `SPOONACULAR_API_KEY`: *(Optional)*
5. Click **Create Web Service**.
6. Copy the deployed backend service URL (e.g. `https://food-analyzer-backend.onrender.com`).

---

### Step 3: Deploy React Frontend (`frontend`)

1. Go to your **Render Dashboard** $\rightarrow$ Click **New +** $\rightarrow$ Select **Static Site** (or **Web Service**).
2. Connect your GitHub repository (`food-analyzer-project`).
3. Configure the service settings:
   - **Name**: `food-analyzer-frontend`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Publish Directory**: `build`
4. Add **Environment Variables**:
   - `REACT_APP_BACKEND_URL`: `https://food-analyzer-backend.onrender.com` *(Use your deployed Spring Boot URL)*
5. Click **Create Static Site**.

---

## 🛠️ Local Development Setup

### 1. Python AI Service
```powershell
cd ai-service
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
python app.py
```
*Service runs on `http://127.0.0.1:5001`*

### 2. Spring Boot Backend
```powershell
cd backend
mvnw.cmd spring-boot:run
```
*Service runs on `http://localhost:8080`*

### 3. React Frontend
```powershell
cd frontend
npm install
npm start
```
*App opens on `http://localhost:3000`*

---

## 📋 Environment Variables Summary

| Variable Name | Component | Description | Example |
| :--- | :--- | :--- | :--- |
| `REACT_APP_BACKEND_URL` | Frontend | URL of deployed Spring Boot backend | `https://food-analyzer-backend.onrender.com` |
| `FLASK_AI_URL` | Backend | URL of deployed Python AI service prediction endpoint | `https://food-analyzer-ai-service.onrender.com/predict` |
| `CORS_ALLOWED_ORIGINS` | Backend | Cross-Origin resource sharing control | `https://food-analyzer-frontend.onrender.com` |
| `SPOONACULAR_API_KEY` | Backend | Optional Spoonacular API Key | `your_key_here` |
| `GEMINI_API_KEY` | AI Service | Optional Gemini 1.5 Vision / AI Coach Agent Key | `your_key_here` |
| `PORT` | All Services | Dynamic listening port injected by Render | `8080` / `5001` |

---

## 🛡️ License & Credits
Built for foodies, health enthusiasts, and nutrition tracking worldwide.
