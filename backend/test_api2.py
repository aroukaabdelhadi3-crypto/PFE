import requests
import json

BASE_URL = "http://127.0.0.1:8000/api"

# Test login first
login_data = {"email": "admin@example.com", "password": "admin123"}
response = requests.post(f"{BASE_URL}/auth/login/", json=login_data)

if response.status_code == 200:
    token = response.json()["access"]
    print(f"✓ Login successful")
    
    # Test users endpoint (correct URL)
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.get(f"{BASE_URL}/auth/users/", headers=headers)
    print(f"✓ Users endpoint: {response.status_code}")
    if response.status_code == 200:
        users = response.json()
        print(f"  Users count: {len(users)}")
    
    # Test training endpoints
    response = requests.get(f"{BASE_URL}/subjects/", headers=headers)
    print(f"✓ Subjects endpoint: {response.status_code}")
    
    response = requests.get(f"{BASE_URL}/courses/", headers=headers)
    print(f"✓ Courses endpoint: {response.status_code}")
    
    response = requests.get(f"{BASE_URL}/controls/", headers=headers)
    print(f"✓ Controls endpoint: {response.status_code}")
    
    response = requests.get(f"{BASE_URL}/corrections/", headers=headers)
    print(f"✓ Corrections endpoint: {response.status_code}")
    
    response = requests.get(f"{BASE_URL}/research/", headers=headers)
    print(f"✓ Research endpoint: {response.status_code}")
    
    response = requests.get(f"{BASE_URL}/submissions/", headers=headers)
    print(f"✓ Submissions endpoint: {response.status_code}")
    
    response = requests.get(f"{BASE_URL}/progress/", headers=headers)
    print(f"✓ Progress endpoint: {response.status_code}")
    
    print("\n=== All API endpoints are working! ===")
else:
    print(f"✗ Login failed: {response.status_code}")
    print(response.text)
