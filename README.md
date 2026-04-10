# NexReply - AI Email Synthesizer 🚀

NexReply is a high-performance, context-aware AI email drafting tool built to automate professional communication. Powered by the incredibly fast Groq API (Llama 3 Model) and backed by a Python FastAPI architecture, it crafts perfect email responses based on dynamic user instructions.

## 🌟 Live Demo
[**Click here to try NexReply live!**](https://nexreply.onrender.com/)

---

## ✨ Features
- **Intelligent Vibe Detection**: Automatically analyzes incoming email threads to detect and lock in the appropriate UI Tone and Urgency without manual input.
- **Glassmorphism Interface**: A completely custom, dark/light hybrid interface featuring animated pastel gradient backgrounds and beautifully blurred semantic cards.
- **Microsecond Generation**: Utilizes Groq’s high-speed inference engine for near-instant language generation, delivering a typing-effect simulation as you read.
- **One-Click Magic**: Seamlessly copy drafted text directly to your system clipboard for immediate application.

## 🛠️ Technology Stack
- **Backend:** OS-Native Python 3 with FastAPI and Uvicorn
- **Frontend:** Pure HTML5, CSS3, and Vanilla JavaScript (Zero bloated frameworks)
- **AI Inference:** Groq Cloud (`llama-3.3-70b-versatile` Model)
- **Hosting Architecture:** Render (Free Cloud Web Service)

## 💻 Local Developer Setup

If you want to run or modify this application locally on your own machine:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/YOUR_USERNAME/email-assistant.git
   cd email-assistant
   ```

2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Configure your API Key:**
   Create a `.env` file in the root directory and add your free Groq API Key (the `.gitignore` prevents this from uploading to GitHub automatically):
   ```env
   GROQ_API_KEY=gsk_your_api_key_here
   ```

4. **Boot the server:**
   ```bash
   python -m uvicorn server:app --host 0.0.0.0 --port 8000 --reload
   ```

5. Open your browser and navigate to `http://localhost:8000`.

---
*Developed as a high-end portfolio demonstration piece.*
