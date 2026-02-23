import google.generativeai as genai
import os

api_key = "AIzaSyCZS_ZidORpGMQrgCXk22u-p9gW1x99Css"
genai.configure(api_key=api_key)

print("Listing models...")
try:
    for m in genai.list_models():
        if 'generateContent' in m.supported_generation_methods:
            print(m.name)
except Exception as e:
    print(f"Error listing models: {e}")
