from django.db import models
from django.conf import settings


class Subject(models.Model):
    """Subject/Matter model."""
    name = models.CharField(max_length=200, unique=True)
    description = models.TextField(blank=True)
    instructor = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='subjects'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name = 'Matière'
        verbose_name_plural = 'Matières'
        ordering = ['name']


class Course(models.Model):
    """Course model for training materials."""
    PART_CHOICES = [
        (1, 'Partie 1'),
        (2, 'Partie 2'),
        (3, 'Partie 3'),
        (4, 'Partie 4'),
    ]
    
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE, related_name='courses')
    title = models.CharField(max_length=300)
    description = models.TextField(blank=True)
    content = models.TextField(blank=True)  # Text content
    file = models.FileField(upload_to='courses/', blank=True, null=True)
    part_number = models.IntegerField(choices=PART_CHOICES)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='created_courses'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.subject.name} - {self.title} (Partie {self.part_number})"
    
    class Meta:
        verbose_name = 'Cours'
        verbose_name_plural = 'Cours'
        ordering = ['part_number', 'title']


class Control(models.Model):
    """Control/Exam model."""
    PART_CHOICES = [
        (1, 'Partie 1'),
        (2, 'Partie 2'),
        (3, 'Partie 3'),
        (4, 'Partie 4'),
    ]
    
    STATUS_CHOICES = [
        ('draft', 'Brouillon'),
        ('published', 'Publié'),
        ('closed', 'Fermé'),
    ]
    
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE, related_name='controls')
    title = models.CharField(max_length=300)
    description = models.TextField(blank=True)
    file = models.FileField(upload_to='controls/', blank=True, null=True)
    part_number = models.IntegerField(choices=PART_CHOICES)
    due_date = models.DateTimeField(blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='created_controls'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.subject.name} - {self.title} (Partie {self.part_number})"
    
    class Meta:
        verbose_name = 'Contrôle'
        verbose_name_plural = 'Contrôles'
        ordering = ['part_number', 'title']


class TraineeSubmission(models.Model):
    """Trainee's submission for a control."""
    STATUS_CHOICES = [
        ('pending', 'En attente'),
        ('submitted', 'Soumis'),
        ('graded', 'Noté'),
    ]
    
    trainee = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='submissions'
    )
    control = models.ForeignKey(Control, on_delete=models.CASCADE, related_name='submissions')
    answer_file = models.FileField(upload_to='submissions/', blank=True, null=True)
    answer_text = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    grade = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    feedback = models.TextField(blank=True, null=True)
    submitted_at = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.trainee.email} - {self.control.title}"
    
    class Meta:
        verbose_name = 'Soumission'
        verbose_name_plural = 'Soumissions'
        unique_together = ['trainee', 'control']


class Correction(models.Model):
    """Correction for a control."""
    PART_CHOICES = [
        (1, 'Partie 1'),
        (2, 'Partie 2'),
        (3, 'Partie 3'),
        (4, 'Partie 4'),
    ]
    
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE, related_name='corrections')
    control = models.ForeignKey(Control, on_delete=models.CASCADE, related_name='corrections', blank=True, null=True)
    part_number = models.IntegerField(choices=PART_CHOICES)
    title = models.CharField(max_length=300)
    file = models.FileField(upload_to='corrections/', blank=True, null=True)
    content = models.TextField(blank=True)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='created_corrections'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Correction - {self.title} (Partie {self.part_number})"
    
    class Meta:
        verbose_name = 'Correction'
        verbose_name_plural = 'Corrections'
        ordering = ['part_number', 'title']


class ResearchTopic(models.Model):
    """Research topic for trainees."""
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE, related_name='research_topics')
    title = models.CharField(max_length=300)
    description = models.TextField()
    file = models.FileField(upload_to='research_topics/', blank=True, null=True)
    due_date = models.DateTimeField(blank=True, null=True)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='research_topics'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.title
    
    class Meta:
        verbose_name = 'Sujet de recherche'
        verbose_name_plural = 'Sujets de recherche'
        ordering = ['-created_at']


class ResearchSubmission(models.Model):
    """Trainee's research topic submission."""
    STATUS_CHOICES = [
        ('pending', 'En attente'),
        ('submitted', 'Soumis'),
    ]
    
    trainee = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='research_submissions'
    )
    research_topic = models.ForeignKey(ResearchTopic, on_delete=models.CASCADE, related_name='submissions')
    answer_file = models.FileField(upload_to='research_submissions/', blank=True, null=True)
    answer_text = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    submitted_at = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.trainee.email} - {self.research_topic.title}"
    
    class Meta:
        verbose_name = 'Soumission de recherche'
        verbose_name_plural = 'Soumissions de recherche'
        unique_together = ['trainee', 'research_topic']


class TrainingProgress(models.Model):
    """Track trainee's training progress."""
    trainee = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='training_progress'
    )
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE, related_name='progress')
    part_1_completed = models.BooleanField(default=False)
    part_2_completed = models.BooleanField(default=False)
    part_3_completed = models.BooleanField(default=False)
    part_4_completed = models.BooleanField(default=False)
    research_completed = models.BooleanField(default=False)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.trainee.email} - {self.subject.name}"
    
    class Meta:
        verbose_name = 'Progression'
        verbose_name_plural = 'Progressions'
        unique_together = ['trainee', 'subject']
