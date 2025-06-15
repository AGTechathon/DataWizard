# 🩺 ArogyaMitra: AI-Powered Virtual Nurse Assistant
![ArogyaMitra Logo](arogya.jpg) *"Democratizing healthcare access through AI-powered voice and vision"*

---

## 🌟 Table of Contents
- [✨ Key Features](#-key-features)
- [🛠️ Tech Stack](#-tech-stack)
- [🏗️ System Architecture](#-system-architecture)
- [💻 Installation](#-installation)
- [🐳 Docker Deployment](#-docker-deployment)

---

## ✨ Key Features

### 🤖 Core Capabilities

| Feature                     | Description                                               |
|----------------------------|-----------------------------------------------------------|
| **Multilingual Voice Interface** | Speech-to-text in 5 Indian languages with symptom analysis |
| **Visual Diagnosis**       | Skin/wound assessment via vision models|
| **Auto-Appointment Booking** | Integrated with 500+ hospitals via Google Calendar API  |

### 🚨 Emergency Features

- Instant first-aid instructions for injuries  
- Critical symptom detection alerts  
- Nearest hospital GPS mapping  

---

## 🛠️ Tech Stack

### Core Components

| Layer        | Technologies                            |
|--------------|-----------------------------------------|
| **Frontend** | React.js, TailwindCSS, ShadCN/ui        |
| **Backend**  | FastAPI (Python), Node.js, Convex DB    |
| **AI/ML**    | PyTorch, Whisper STT, Google TTS        |
| **APIs**     | Twilio SMS, Google Calendar, Deepgram   |
| **DevOps**   | Docker, GitHub Actions, Prometheus      |



---
## 🧠 System Architecture

```mermaid
graph TD
    A[User] --> B(React Frontend)
    B --> C{FastAPI Server}
    C --> E[AI Inference Engine]
    E --> F[Vision Models]
    E --> G[Voice Pipeline]
    C --> I[Third-Party APIs]
    B --> J[Node.js Service Layer]
    J --> H[Convex Database]
    J --> D[Auth Service]
    B --> L[WebRTC (livekit) Stream]
```


### 1. **User Interaction Layer**
- **Frontend (ArogyaBot UI)**
  - Built with React + Tailwind CSS
  - Supports image uploads and webcam capture
  - Accepts voice and text input
  - Displays multilingual responses in real time

- **Authentication System**
  - Secure login/signup via stack-auth

---

### 2. **Backend Services Layer**
- **Flask Server**
  - Handles API requests and orchestrates the workflow
  - Communicates with AI modules and databases

- **Speech Engine**
  - **OpenAI STT** with Whisper-Medium for transcription and noise suppression
  - **Deepgram TTS** with emotion-injected speech generation
  - **Google TTS** with emotion-injected Multilingual speech generation

---

### 3. **Core Utilities & Infrastructure**
- **Redis**
  - Caches temporary session data and transcription buffers

- **FFmpeg**
  - Handles audio preprocessing and media conversion

- **Docker**
  - Ensures containerized deployment for backend and frontend

---

### 4. **Emergency Response System**
- **Alert Dispatcher**
  - Auto-initiates hospital calls for critical injuries or distress
  - Logs incident to medical staff dashboard

- **Dashboard**
  - Displays  Helath tools to the user
  - 
---


## 💻 Installation

### Prerequisites

- **Python** **3.11+**
- **Node.js** **18.15+**
- **Redis Server** **7.2+**
- **FFmpeg** **6.0+**

### Local Setup

```bash
# Clone reposito    ry
git clone https://github.com/AGTechathon/DataWizard
cd DataWizard

# Install Python dependencies
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Setup frontend
cd client
npm install
npm run build

# Configure environment variables
cp .env.example .env
```
---

## 🐳 Docker Deployment

```bash
docker-compose -f docker-compose.prod.yml up --build
