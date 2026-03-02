import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'pfe.settings')
django.setup()
from accounts.models import User

if not User.objects.filter(username='admin').exists():
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
else:
    print('Admin user already exists!')
