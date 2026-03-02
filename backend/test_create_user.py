import requests
import json

BASE_URL = "http://127.0.0.1:8000/api"

# Login first
login_data = {"email": "admin@example.com", "password": "admin123"}
response = requests.post(f"{BASE_URL}/auth/login/", json=login_data)
token = response.json()["access"]
headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}

# Try to create a user with password
user_data = {
    "email": "test@example.com",
    "username": "testuser",
    "first_name": "Test",
    "last_name": "User",
    "role": "trainee",
    "password": "password123",
    "password_confirm": "password123"
}

response = requests.post(f"{BASE_URL}/auth/users/", json=user_data, headers=headers)
print(f"Status: {response.status_code}")
print(f"Response: {response.text}")
