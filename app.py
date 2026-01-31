from flask import Flask, request, jsonify, render_template
from utils.genai_utils import generate_text
from utils.code_executor import generate_code
from utils.audio_utils import generate_audio
from utils.image_utils import generate_image

app = Flask(__name__)

# ---------------- TEXT ----------------
@app.route("/api/text", methods=["POST"])
def text_learning():
    data = request.json
    topic = data.get("topic")
    depth = data.get("depth", "Comprehensive")

    result = generate_text(topic, depth)
    return jsonify({"text": result})


# ---------------- CODE ----------------
@app.route("/api/code", methods=["POST"])
def code_learning():
    data = request.json
    topic = data.get("topic")
    level = data.get("level", "Detailed")

    result = generate_code(topic, level)
    return jsonify({"code": result})


# ---------------- AUDIO ----------------
@app.route("/api/audio", methods=["POST"])
def audio_learning():
    data = request.json
    topic = data.get("topic")

    file_path = generate_audio(topic)
    return jsonify({"audio_file": file_path})


# ---------------- IMAGE ----------------
@app.route("/api/image", methods=["POST"])
def image_learning():
    data = request.json
    topic = data.get("topic")

    result = generate_image(topic)
    return jsonify(result)

@app.route("/")
def home():
    return render_template("home3.html")


if __name__ == "__main__":
    app.run(debug=True)

