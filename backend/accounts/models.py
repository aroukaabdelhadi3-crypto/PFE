from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    """Custom User model with role-based authentication."""
    
    ROLE_CHOICES = [
        ('admin', 'Administrateur'),
        ('instructor', 'Instructeur'),
        ('coordinator', 'Coordinateur'),
        ('supervisor', 'Superviseur'),
        ('trainee', 'Stagiaire'),
    ]
    
    email = models.EmailField(unique=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='trainee')
    phone = models.CharField(max_length=20, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'first_name', 'last_name']
    
    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.get_role_display()})"
    
    @property
    def is_admin(self):
        return self.role == 'admin' or self.is_superuser
    
    @property
    def is_instructor(self):
        return self.role == 'instructor'
    
    @property
    def is_coordinator(self):
        return self.role == 'coordinator'
    
    @property
    def is_supervisor(self):
        return self.role == 'supervisor'
    
    @property
    def is_trainee(self):
        return self.role == 'trainee'
    
    class Meta:
        verbose_name = 'Utilisateur'
        verbose_name_plural = 'Utilisateurs'
        ordering = ['-created_at']
