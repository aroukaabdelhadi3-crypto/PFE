from rest_framework import serializers
from django.utils import timezone
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
        # Handle empty strings for optional fields
        for field_name in ['due_date']:
            if field_name in data and data[field_name] == '':
                data[field_name] = None
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
        # Handle empty strings for optional fields
        for field_name in ['due_date']:
            if field_name in data and data[field_name] == '':
                data[field_name] = None
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
