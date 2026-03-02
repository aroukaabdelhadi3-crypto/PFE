import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'pfe.settings')
django.setup()
from accounts.models import User

# Delete existing admin if exists
User.objects.filter(email='admin@example.com').delete()

# Create user with proper password hashing
user = User(
    username='admin',
    email='admin@example.com',
    first_name='Admin',
    last_name='User',
    role='admin',
    is_staff=True,
    is_superuser=True,
    is_active=True
)
user.set_password('admin123')
user.save()

print('Admin user created!')
print('Email: admin@example.com')
print('Password: admin123')

# Verify
from django.contrib.auth import authenticate
user = authenticate(username='admin', password='admin123')
if user:
    print('Authentication: SUCCESS')
else:
    print('Authentication: FAILED - trying with email')
    user = authenticate(email='admin@example.com', password='admin123')
    if user:
        print('Authentication with email: SUCCESS')
