import os
import json
from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

client = OpenAI(
    base_url="https://api.groq.com/openai/v1",
    api_key=os.environ.get("GROQ_API_KEY", "")
)

class ReplyRequest(BaseModel):
    email: str
    tone: str
    length: str
    urgency: str
    context: str = ""

class AnalyzeRequest(BaseModel):
    email: str

@app.post("/api/analyze")
async def analyze_email(req: AnalyzeRequest):
    if not os.environ.get("GROQ_API_KEY"):
        raise HTTPException(status_code=500, detail="API Key not found in Environment. Check .env file.")
        
    system_prompt = """You are an analytical AI that extracts tone and urgency from incoming emails.
Analyze the provided email and respond STRICTLY in JSON format with exactly two keys: "tone" and "urgency".
For "tone", map the email's vibe to ONE of these exact string values based on how you should respond: "Professional & Executive", "Friendly & Approachable", "Direct & Assertive", or "Apologetic & Empathetic".
For "urgency", map it to ONE of these exact string values: "Normal" or "Urgent ASAP".
Do not output anything else except the JSON object."""

    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": f"Incoming Email:\n{req.email}"}
            ],
            temperature=0.1,
            response_format={"type": "json_object"}
        )
        # Parse JSON
        return json.loads(response.choices[0].message.content)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/generate")
async def generate_reply(req: ReplyRequest):
    if not os.environ.get("GROQ_API_KEY"):
        raise HTTPException(status_code=500, detail="API Key not found in Environment. Check .env file.")
        
    system_prompt = "You are a world-class AI executive assistant."
    prompt = f"""
    Analyze the following incoming email and write a highly effective, natural-sounding reply.
    
    Tone: {req.tone}
    Length Strategy: {req.length}
    Urgency Context: {req.urgency}
    
    Incoming Email:
    {req.email}
    """
    
    if req.context.strip():
        prompt += f"\n\nCRITICAL CONTEXT TO INCLUDE:\n{req.context}"
        
    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7
        )
        return {"reply": response.choices[0].message.content}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# We will mount static files to serve the raw HTML/CSS/JS User Interface
app.mount("/static", StaticFiles(directory="static"), name="static")

@app.get("/")
def serve_index():
    return FileResponse("static/index.html")
