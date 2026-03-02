import requests
import json

BASE_URL = "http://127.0.0.1:8000/api"

# Login first
login_data = {"email": "admin@example.com", "password": "admin123"}
response = requests.post(f"{BASE_URL}/auth/login/", json=login_data)
token = response.json()["access"]
headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}

# Try to create a user with a stronger password
user_data = {
    "email": "instructor1@example.com",
    "username": "instructor1",
    "first_name": "Ahmed",
    "last_name": "Instructor",
    "role": "instructor",
    "password": "StrongPass123!",
    "password_confirm": "StrongPass123!"
}

response = requests.post(f"{BASE_URL}/auth/users/", json=user_data, headers=headers)
print(f"Status: {response.status_code}")
print(f"Response: {response.text}")

# If successful, let's also try to create a trainee
if response.status_code == 201:
    user_data2 = {
        "email": "trainee1@example.com",
        "username": "trainee1",
        "first_name": "Ali",
        "last_name": "Trainee",
        "role": "trainee",
        "password": "TraineePass456!",
        "password_confirm": "TraineePass456!"
    }
    response2 = requests.post(f"{BASE_URL}/auth/users/", json=user_data2, headers=headers)
    print(f"\nTrainee Status: {response2.status_code}")
    print(f"Trainee Response: {response2.text}")
