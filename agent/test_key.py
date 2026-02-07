"""
Simple script to test Google Gemini API key directly.
Usage: python agent/test_key.py
"""
import os
import google.genai as genai
from dotenv import load_dotenv
from pathlib import Path

# Load env from agent/.env
env_path = Path(__file__).parent / ".env"
load_dotenv(env_path)

api_key = os.getenv("GOOGLE_API_KEY")
print(f"🔑 Testing API Key: {api_key[:8]}...{api_key[-4:] if api_key else 'None'}")

if not api_key:
    print("❌ API Key not found!")
    exit(1)

try:
    client = genai.Client(api_key=api_key)
    response = client.models.generate_content(
        model="gemini-2.0-flash",
        contents="Hello, represent Dubai in one emoji."
    )
    print(f"✅ Success! Response: {response.text}")
except Exception as e:
    print(f"❌ Error: {e}")
