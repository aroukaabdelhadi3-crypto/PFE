import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'pfe.settings')
django.setup()

from accounts.models import User
from django.contrib.auth import authenticate

# Check all users
users = User.objects.all()
print("Users in database:")
for u in users:
    print(f"  - username: {u.username}, email: {u.email}, role: {u.role}")

# Test authentication with username
user = authenticate(username='admin', password='admin123')
if user:
    print(f"\nAuthentication with username SUCCESS: {user.username}")
else:
    print("\nAuthentication with username FAILED")

# Test authentication with email (shouldn't work directly)
user = authenticate(username='admin@example.com', password='admin123')
if user:
    print(f"Authentication with email SUCCESS: {user.username}")
else:
    print("Authentication with email FAILED (expected)")
