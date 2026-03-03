from rest_framework import serializers
from django.utils import timezone
from datetime import datetime
from .models import (
    Subject, Course, Control, TraineeSubmission, 
    Correction, ResearchTopic, ResearchSubmission, TrainingProgress
)


class SubjectSerializer(serializers.ModelSerializer):
    instructor_name = serializers.CharField(source='instructor.get_full_name', read_only=True)
    
    class Meta:
        model = Subject
        fields = ['id', 'name', 'description', 'instructor', 'instructor_name', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class CourseSerializer(serializers.ModelSerializer):
    subject_name = serializers.CharField(source='subject.name', read_only=True)
    created_by_name = serializers.CharField(source='created_by.get_full_name', read_only=True)
    
    class Meta:
        model = Course
        fields = ['id', 'subject', 'subject_name', 'title', 'description', 'content', 
                  'file', 'part_number', 'created_by', 'created_by_name', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class CourseListSerializer(serializers.ModelSerializer):
    subject_name = serializers.CharField(source='subject.name', read_only=True)
    
    class Meta:
        model = Course
        fields = ['id', 'subject', 'subject_name', 'title', 'description', 'content', 'part_number', 'file', 'created_at']


class ControlSerializer(serializers.ModelSerializer):
    subject_name = serializers.CharField(source='subject.name', read_only=True)
    created_by_name = serializers.CharField(source='created_by.get_full_name', read_only=True)
    is_past_due = serializers.SerializerMethodField()
    due_date = serializers.DateTimeField(required=False, allow_null=True)
    
    class Meta:
        model = Control
        fields = ['id', 'subject', 'subject_name', 'title', 'description', 'file',
                  'part_number', 'due_date', 'status', 'created_by', 'created_by_name',
                  'created_at', 'updated_at', 'is_past_due']
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_is_past_due(self, obj):
        if obj.due_date:
            return obj.due_date < timezone.now()
        return False
    
    def to_internal_value(self, data):
        # Handle due_date - convert string date to datetime
        if 'due_date' in data and data['due_date']:
            date_str = data['due_date']
            if isinstance(date_str, str) and date_str not in ['', 'null', 'None']:
                try:
                    # Try to parse the date string
                    data = data.copy()
                    # Handle both date and datetime formats
                    if 'T' in date_str:
                        data['due_date'] = datetime.fromisoformat(date_str.replace('Z', '+00:00'))
                    else:
                        # Append time to make it a full datetime
                        data['due_date'] = datetime.strptime(date_str, '%Y-%m-%d')
                except (ValueError, TypeError):
                    data['due_date'] = None
            else:
                data = data.copy()
                data['due_date'] = None
        elif 'due_date' in data:
            data = data.copy()
            data['due_date'] = None
        return super().to_internal_value(data)


class ControlListSerializer(serializers.ModelSerializer):
    subject_name = serializers.CharField(source='subject.name', read_only=True)
    is_past_due = serializers.SerializerMethodField()
    
    class Meta:
        model = Control
        fields = ['id', 'subject', 'subject_name', 'title', 'part_number', 'due_date', 'status', 'is_past_due']
    
    def get_is_past_due(self, obj):
        if obj.due_date:
            return obj.due_date < timezone.now()
        return False


class TraineeSubmissionSerializer(serializers.ModelSerializer):
    trainee_name = serializers.CharField(source='trainee.get_full_name', read_only=True)
    control_title = serializers.CharField(source='control.title', read_only=True)
    part_number = serializers.IntegerField(source='control.part_number', read_only=True)
    
    class Meta:
        model = TraineeSubmission
        fields = ['id', 'trainee', 'trainee_name', 'control', 'control_title', 'part_number',
                  'answer_file', 'answer_text', 'status', 'grade', 'feedback', 'submitted_at', 'created_at', 'updated_at']
        read_only_fields = ['id', 'status', 'submitted_at', 'created_at', 'updated_at']


class TraineeSubmissionCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = TraineeSubmission
        fields = ['answer_file', 'answer_text']
    
    def create(self, validated_data):
        validated_data['trainee'] = self.context['request'].user
        validated_data['status'] = 'submitted'
        validated_data['submitted_at'] = timezone.now()
        return super().create(validated_data)


class CorrectionSerializer(serializers.ModelSerializer):
    subject_name = serializers.CharField(source='subject.name', read_only=True)
    created_by_name = serializers.CharField(source='created_by.get_full_name', read_only=True)
    
    class Meta:
        model = Correction
        fields = ['id', 'subject', 'subject_name', 'control', 'part_number', 'title',
                  'file', 'content', 'created_by', 'created_by_name', 'created_at']
        read_only_fields = ['id', 'created_at']


class ResearchTopicSerializer(serializers.ModelSerializer):
    subject_name = serializers.CharField(source='subject.name', read_only=True)
    created_by_name = serializers.CharField(source='created_by.get_full_name', read_only=True)
    is_past_due = serializers.SerializerMethodField()
    due_date = serializers.DateTimeField(required=False, allow_null=True)
    
    class Meta:
        model = ResearchTopic
        fields = ['id', 'subject', 'subject_name', 'title', 'description', 'file', 'due_date',
                  'created_by', 'created_by_name', 'created_at', 'is_past_due']
        read_only_fields = ['id', 'created_at']
    
    def get_is_past_due(self, obj):
        if obj.due_date:
            return obj.due_date < timezone.now()
        return False
    
    def to_internal_value(self, data):
        # Handle due_date - convert string date to datetime
        if 'due_date' in data and data['due_date']:
            date_str = data['due_date']
            if isinstance(date_str, str) and date_str not in ['', 'null', 'None']:
                try:
                    data = data.copy()
                    if 'T' in date_str:
                        data['due_date'] = datetime.fromisoformat(date_str.replace('Z', '+00:00'))
                    else:
                        data['due_date'] = datetime.strptime(date_str, '%Y-%m-%d')
                except (ValueError, TypeError):
                    data['due_date'] = None
            else:
                data = data.copy()
                data['due_date'] = None
        elif 'due_date' in data:
            data = data.copy()
            data['due_date'] = None
        return super().to_internal_value(data)


class ResearchSubmissionSerializer(serializers.ModelSerializer):
    trainee_name = serializers.CharField(source='trainee.get_full_name', read_only=True)
    topic_title = serializers.CharField(source='research_topic.title', read_only=True)
    
    class Meta:
        model = ResearchSubmission
        fields = ['id', 'trainee', 'trainee_name', 'research_topic', 'topic_title',
                  'answer_file', 'answer_text', 'status', 'submitted_at', 'created_at']
        read_only_fields = ['id', 'status', 'submitted_at', 'created_at']


class ResearchSubmissionCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ResearchSubmission
        fields = ['answer_file', 'answer_text']
    
    def create(self, validated_data):
        validated_data['trainee'] = self.context['request'].user
        validated_data['status'] = 'submitted'
        validated_data['submitted_at'] = timezone.now()
        return super().create(validated_data)


class TrainingProgressSerializer(serializers.ModelSerializer):
    trainee_name = serializers.CharField(source='trainee.get_full_name', read_only=True)
    subject_name = serializers.CharField(source='subject.name', read_only=True)
    
    class Meta:
        model = TrainingProgress
        fields = ['id', 'trainee', 'trainee_name', 'subject', 'subject_name',
                  'part_1_completed', 'part_2_completed', 'part_3_completed', 
                  'part_4_completed', 'research_completed', 'updated_at']
        read_only_fields = ['id', 'updated_at']
