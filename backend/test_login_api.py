import requests
import json

url = "http://127.0.0.1:8000/api/auth/login/"
data = {"email": "admin@example.com", "password": "admin123"}
headers = {"Content-Type": "application/json"}

try:
    response = requests.post(url, json=data, headers=headers)
    print(f"Status: {response.status_code}")
    print(f"Response: {response.text}")
except Exception as e:
    print(f"Error: {e}")
