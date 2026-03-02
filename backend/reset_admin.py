import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'pfe.settings')
django.setup()
from accounts.models import User

# Delete existing admin if exists
User.objects.filter(username='admin').delete()

# Create new admin user
user = User.objects.create_superuser(
    username='admin',
    email='admin@example.com',
    password='admin123',
    first_name='Admin',
    last_name='User',
    role='admin'
)
print('Admin user created successfully!')
print('Email: admin@example.com')
print('Password: admin123')

# Verify the user can authenticate
from django.contrib.auth import authenticate
user = authenticate(username='admin', password='admin123')
if user:
    print('Authentication test: SUCCESS')
else:
    print('Authentication test: FAILED')
