from flask import Flask, render_template, request, jsonify
from dotenv import load_dotenv
from google import genai
from gtts import gTTS
import os
import uuid

# --------------------
# SETUP
# --------------------

load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    raise RuntimeError("GEMINI_API_KEY not found. Check .env file.")

client = genai.Client(api_key=GEMINI_API_KEY)

MODEL_NAME = "gemini-2.5-flash"

app = Flask(__name__)

AUDIO_DIR = "static/audio"
os.makedirs(AUDIO_DIR, exist_ok=True)

# --------------------
# PAGE ROUTES
# --------------------

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/text")
def text_page():
    return render_template("text_explanation.html")

@app.route("/code")
def code_page():
    return render_template("code_generation.html")

@app.route("/image")
def image_page():
    return render_template("image_generation.html")

@app.route("/audio")
def audio_page():
    return render_template("audio_generation.html")

# --------------------
# GEMINI HELPER
# --------------------

def ask_gemini(prompt):
    response = client.models.generate_content(
        model=MODEL_NAME,
        contents=prompt
    )
    return response.text

# --------------------
# TEXT EXPLANATION
# --------------------

@app.route("/api/text", methods=["POST"])
def generate_text():
    topic = request.json.get("prompt")

    prompt = f"""
You are an expert Machine Learning professor.
Explain the ML topic "{topic}" clearly.
Include:
- definition
- working
- advantages
- disadvantages
- real-world examples
"""

    explanation = ask_gemini(prompt)
    return jsonify({"response": explanation})

# --------------------
# CODE GENERATION
# --------------------

@app.route("/api/code", methods=["POST"])
def generate_code():
    topic = request.json.get("prompt")

    prompt = f"""
You are a senior Machine Learning engineer.
Generate clean, executable Python code using scikit-learn for:
"{topic}"

Requirements:
- include comments
- use best practices
- student friendly
"""

    code = ask_gemini(prompt)
    return jsonify({"code": code})

# --------------------
# IMAGE / VISUAL LOGIC
# --------------------

@app.route("/api/image", methods=["POST"])
def generate_image():
    topic = request.json.get("prompt")

    prompt = f"""
Explain "{topic}" using a diagram-based approach.
Describe:
- components
- data flow
- steps
Use bullet points and structured format.
"""

    visual_text = ask_gemini(prompt)

    return jsonify({
        "message": "Visual explanation generated",
        "visual": visual_text
    })

# --------------------
# AUDIO GENERATION
# --------------------

@app.route("/api/audio", methods=["POST"])
def generate_audio():
    topic = request.json.get("text")

    prompt = f"""
Explain "{topic}" in a simple, spoken teaching style.
Keep it clear and concise.
"""

    explanation = ask_gemini(prompt)

    filename = f"{uuid.uuid4()}.mp3"
    filepath = os.path.join(AUDIO_DIR, filename)

    tts = gTTS(explanation)
    tts.save(filepath)

    return jsonify({
        "audioUrl": f"/static/audio/{filename}",
        "script": explanation
    })

# --------------------
# RUN
# --------------------

if __name__ == "__main__":
    app.run(debug=True)
