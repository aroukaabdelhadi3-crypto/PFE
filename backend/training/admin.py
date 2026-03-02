from django.contrib import admin
from .models import (
    Subject, Course, Control, TraineeSubmission, 
    Correction, ResearchTopic, ResearchSubmission, TrainingProgress
)


@admin.register(Subject)
class SubjectAdmin(admin.ModelAdmin):
    list_display = ['name', 'instructor', 'created_at']
    search_fields = ['name']
    list_filter = ['created_at']


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ['title', 'subject', 'part_number', 'created_by', 'created_at']
    list_filter = ['part_number', 'subject', 'created_at']
    search_fields = ['title', 'subject__name']


@admin.register(Control)
class ControlAdmin(admin.ModelAdmin):
    list_display = ['title', 'subject', 'part_number', 'status', 'due_date', 'created_by']
    list_filter = ['part_number', 'status', 'subject', 'created_at']
    search_fields = ['title', 'subject__name']


@admin.register(TraineeSubmission)
class TraineeSubmissionAdmin(admin.ModelAdmin):
    list_display = ['trainee', 'control', 'status', 'submitted_at']
    list_filter = ['status', 'control__part_number']
    search_fields = ['trainee__email', 'control__title']


@admin.register(Correction)
class CorrectionAdmin(admin.ModelAdmin):
    list_display = ['title', 'subject', 'part_number', 'created_by', 'created_at']
    list_filter = ['part_number', 'subject']
    search_fields = ['title', 'subject__name']


@admin.register(ResearchTopic)
class ResearchTopicAdmin(admin.ModelAdmin):
    list_display = ['title', 'subject', 'due_date', 'created_by']
    list_filter = ['subject', 'created_at']
    search_fields = ['title', 'subject__name']


@admin.register(ResearchSubmission)
class ResearchSubmissionAdmin(admin.ModelAdmin):
    list_display = ['trainee', 'research_topic', 'status', 'submitted_at']
    list_filter = ['status']
    search_fields = ['trainee__email', 'research_topic__title']


@admin.register(TrainingProgress)
class TrainingProgressAdmin(admin.ModelAdmin):
    list_display = ['trainee', 'subject', 'part_1_completed', 'part_2_completed', 
                    'part_3_completed', 'part_4_completed', 'research_completed']
    list_filter = ['subject', 'part_1_completed', 'part_2_completed', 
                   'part_3_completed', 'part_4_completed', 'research_completed']
    search_fields = ['trainee__email', 'subject__name']
