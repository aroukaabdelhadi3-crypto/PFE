#!/usr/bin/env python
"""
Script to create initial admin user and demo data.
Run this script after cloning the project to set up initial data.
"""
import os
import sys
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'pfe.settings')
django.setup()

from django.contrib.auth import get_user_model
from accounts.models import User

def create_admin_user():
    """Create a default admin user."""
    User = get_user_model()
    
    # Check if admin already exists
    if User.objects.filter(role='admin').exists():
        print("Admin user already exists!")
        return
    
    # Create admin user
    admin = User.objects.create_superuser(
        username='admin',
        email='admin@pfe.com',
        password='admin123',
        first_name='Admin',
        last_name='User',
        role='admin'
    )
    
    print(f"Admin user created successfully!")
    print(f"Email: admin@pfe.com")
    print(f"Password: admin123")
    print("\nIMPORTANT: Change the password after first login!")

def create_demo_instructor():
    """Create a demo instructor."""
    User = get_user_model()
    
    if not User.objects.filter(email='instructor@pfe.com').exists():
        instructor = User.objects.create_user(
            username='instructor',
            email='instructor@pfe.com',
            password='instructor123',
            first_name='Instructeur',
            last_name='Demo',
            role='instructor'
        )
        print(f"\nDemo instructor created:")
        print(f"Email: instructor@pfe.com")
        print(f"Password: instructor123")

def create_demo_trainee():
    """Create a demo trainee."""
    User = get_user_model()
    
    if not User.objects.filter(email='trainee@pfe.com').exists():
        trainee = User.objects.create_user(
            username='trainee',
            email='trainee@pfe.com',
            password='trainee123',
            first_name='Stagiaire',
            last_name='Demo',
            role='trainee'
        )
        print(f"\nDemo trainee created:")
        print(f"Email: trainee@pfe.com")
        print(f"Password: trainee123")

if __name__ == '__main__':
    print("=" * 50)
    print("PFE - Creating Initial Data")
    print("=" * 50)
    
    create_admin_user()
    create_demo_instructor()
    create_demo_trainee()
    
    print("\n" + "=" * 50)
    print("Setup complete!")
    print("=" * 50)
