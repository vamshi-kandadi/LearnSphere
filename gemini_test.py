from google import genai
import os

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

response = client.models.generate_content(
    model="gemini-1.5-flash",
    contents="Explain machine learning in one line"
)

print(response.text)
