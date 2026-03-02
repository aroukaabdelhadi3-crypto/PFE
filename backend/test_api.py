import requests
import json

BASE_URL = "http://127.0.0.1:8000/api"

# Test login first
login_data = {"email": "admin@example.com", "password": "admin123"}
response = requests.post(f"{BASE_URL}/auth/login/", json=login_data)

if response.status_code == 200:
    token = response.json()["access"]
    print(f"✓ Login successful")
    
    # Test subjects endpoint
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.get(f"{BASE_URL}/subjects/", headers=headers)
    print(f"✓ Subjects endpoint: {response.status_code}")
    
    # Test users endpoint
    response = requests.get(f"{BASE_URL}/users/", headers=headers)
    print(f"✓ Users endpoint: {response.status_code}")
    
    # Test courses endpoint
    response = requests.get(f"{BASE_URL}/courses/", headers=headers)
    print(f"✓ Courses endpoint: {response.status_code}")
    
    # Test controls endpoint
    response = requests.get(f"{BASE_URL}/controls/", headers=headers)
    print(f"✓ Controls endpoint: {response.status_code}")
    
    print("\n=== All API endpoints are working! ===")
else:
    print(f"✗ Login failed: {response.status_code}")
    print(response.text)
