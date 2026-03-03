from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q
from .models import (
    Subject, Course, Control, TraineeSubmission,
    Correction, ResearchTopic, ResearchSubmission, TrainingProgress
)
from .serializers import (
    SubjectSerializer, CourseSerializer, CourseListSerializer,
    ControlSerializer, ControlListSerializer,
    TraineeSubmissionSerializer, TraineeSubmissionCreateSerializer,
    CorrectionSerializer, ResearchTopicSerializer,
    ResearchSubmissionSerializer, ResearchSubmissionCreateSerializer,
    TrainingProgressSerializer
)


class SubjectViewSet(viewsets.ModelViewSet):
    """ViewSet for managing subjects."""
    queryset = Subject.objects.all()
    serializer_class = SubjectSerializer
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.IsAuthenticated()]
        return [permissions.IsAdminUser()]
    
    def get_queryset(self):
        user = self.request.user
        if user.is_admin:
            return Subject.objects.all()
        elif user.is_instructor:
            # Instructors see all subjects - they can create courses for any subject
            return Subject.objects.all()
        # Trainees, coordinators, supervisors see all subjects
        return Subject.objects.all()
    
    def perform_create(self, serializer):
        # Admin creates subject - get instructor from request data if provided
        instructor_id = self.request.data.get('instructor')
        if instructor_id:
            from accounts.models import User
            try:
                instructor = User.objects.get(id=int(instructor_id))
                serializer.save(instructor=instructor)
                return
            except (User.DoesNotExist, ValueError):
                pass
        serializer.save()


class IsAdminOrInstructor(permissions.BasePermission):
    """Allow admin or instructor to create/update/delete."""
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        return request.user.is_admin or request.user.is_instructor


class CourseViewSet(viewsets.ModelViewSet):
    """ViewSet for managing courses."""
    queryset = Course.objects.all()
    
    def get_serializer_class(self):
        if self.action == 'list':
            return CourseListSerializer
        return CourseSerializer
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.IsAuthenticated()]
        return [IsAdminOrInstructor()]
    
    def get_queryset(self):
        queryset = Course.objects.all()
        part_number = self.request.query_params.get('part_number')
        subject_id = self.request.query_params.get('subject')
        
        if part_number:
            queryset = queryset.filter(part_number=int(part_number))
        if subject_id:
            queryset = queryset.filter(subject_id=int(subject_id))
        
        return queryset.order_by('part_number', 'title')
    
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)


class ControlViewSet(viewsets.ModelViewSet):
    """ViewSet for managing controls/exams."""
    queryset = Control.objects.all()
    
    def get_serializer_class(self):
        if self.action == 'list':
            return ControlListSerializer
        return ControlSerializer
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.IsAuthenticated()]
        return [permissions.IsAdminUser()]
    
    def get_queryset(self):
        queryset = Control.objects.all()
        part_number = self.request.query_params.get('part_number')
        subject_id = self.request.query_params.get('subject')
        status_filter = self.request.query_params.get('status')
        
        if part_number:
            queryset = queryset.filter(part_number=int(part_number))
        if subject_id:
            queryset = queryset.filter(subject_id=int(subject_id))
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        
        return queryset.order_by('part_number', 'title')
    
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)
    
    @action(detail=True, methods=['post'])
    def publish(self, request, pk=None):
        """Publish a control."""
        control = self.get_object()
        control.status = 'published'
        control.save()
        return Response({'status': 'Contrôle publié avec succès.'})
    
    @action(detail=True, methods=['post'])
    def close(self, request, pk=None):
        """Close a control."""
        control = self.get_object()
        control.status = 'closed'
        control.save()
        return Response({'status': 'Contrôle fermé avec succès.'})


class SubmissionViewSet(viewsets.ModelViewSet):
    """ViewSet for managing trainee submissions."""
    queryset = TraineeSubmission.objects.all()
    
    def get_serializer_class(self):
        if self.action == 'create':
            return TraineeSubmissionCreateSerializer
        return TraineeSubmissionSerializer
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.IsAuthenticated()]
        return [permissions.IsAdminUser() | permissions.IsInstructor()]
    
    def get_queryset(self):
        user = self.request.user
        queryset = TraineeSubmission.objects.all()
        
        if user.is_trainee:
            queryset = queryset.filter(trainee=user)
        elif user.is_instructor:
            # Instructor sees submissions for their subjects
            queryset = queryset.filter(control__subject__instructor=user)
        
        # Filter by part number
        part_number = self.request.query_params.get('part_number')
        if part_number:
            queryset = queryset.filter(control__part_number=int(part_number))
        
        return queryset.order_by('-submitted_at')
    
    @action(detail=True, methods=['post'])
    def grade(self, request, pk=None):
        """Grade a submission."""
        submission = self.get_object()
        grade = request.data.get('grade')
        feedback = request.data.get('feedback', '')
        
        if grade is None:
            return Response({'error': 'La note est requise.'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            submission.grade = float(grade)
        except (ValueError, TypeError):
            return Response({'error': 'Note invalide.'}, status=status.HTTP_400_BAD_REQUEST)
        
        submission.feedback = feedback
        submission.status = 'graded'
        submission.save()
        return Response({'status': 'Soumission notée avec succès.'})


class CorrectionViewSet(viewsets.ModelViewSet):
    """ViewSet for managing corrections."""
    queryset = Correction.objects.all()
    serializer_class = CorrectionSerializer
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.IsAuthenticated()]
        return [permissions.IsAdminUser() | permissions.IsInstructor()]
    
    def get_queryset(self):
        queryset = Correction.objects.all()
        part_number = self.request.query_params.get('part_number')
        
        if part_number:
            queryset = queryset.filter(part_number=int(part_number))
        
        return queryset.order_by('part_number', 'title')
    
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)


class ResearchTopicViewSet(viewsets.ModelViewSet):
    """ViewSet for managing research topics."""
    queryset = ResearchTopic.objects.all()
    serializer_class = ResearchTopicSerializer
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.IsAuthenticated()]
        return [permissions.IsAdminUser() | permissions.IsInstructor()]
    
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)


class ResearchSubmissionViewSet(viewsets.ModelViewSet):
    """ViewSet for managing research submissions."""
    queryset = ResearchSubmission.objects.all()
    
    def get_serializer_class(self):
        if self.action == 'create':
            return ResearchSubmissionCreateSerializer
        return ResearchSubmissionSerializer
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.IsAuthenticated()]
        return [permissions.IsAdminUser() | permissions.IsInstructor()]
    
    def get_queryset(self):
        user = self.request.user
        queryset = ResearchSubmission.objects.all()
        
        if user.is_trainee:
            queryset = queryset.filter(trainee=user)
        elif user.is_instructor:
            queryset = queryset.filter(research_topic__subject__instructor=user)
        
        return queryset.order_by('-submitted_at')


class TrainingProgressViewSet(viewsets.ModelViewSet):
    """ViewSet for managing training progress."""
    queryset = TrainingProgress.objects.all()
    serializer_class = TrainingProgressSerializer
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.IsAuthenticated()]
        return [permissions.IsAdminUser() | permissions.IsCoordinator() | permissions.IsSupervisor()]
    
    def get_queryset(self):
        user = self.request.user
        queryset = TrainingProgress.objects.all()
        
        if user.is_trainee:
            queryset = queryset.filter(trainee=user)
        
        # Filter by subject
        subject_id = self.request.query_params.get('subject')
        if subject_id:
            queryset = queryset.filter(subject_id=int(subject_id))
        
        return queryset
    
    @action(detail=True, methods=['post'])
    def update_progress(self, request, pk=None):
        """Update training progress."""
        progress = self.get_object()
        part_number = request.data.get('part_number')
        
        if part_number == 1:
            progress.part_1_completed = True
        elif part_number == 2:
            progress.part_2_completed = True
        elif part_number == 3:
            progress.part_3_completed = True
        elif part_number == 4:
            progress.part_4_completed = True
        elif part_number == 'research':
            progress.research_completed = True
        
        progress.save()
        return Response({'status': 'Progression mise à jour avec succès.'})


# Dashboard statistics
class DashboardView(viewsets.ViewSet):
    """Dashboard statistics."""
    permission_classes = [permissions.IsAuthenticated]
    
    def list(self, request):
        user = request.user
        data = {}
        
        if user.is_admin:
            from accounts.models import User
            data['total_users'] = User.objects.count()
            data['total_instructors'] = User.objects.filter(role='instructor').count()
            data['total_trainees'] = User.objects.filter(role='trainee').count()
            data['total_subjects'] = Subject.objects.count()
            data['total_courses'] = Course.objects.count()
            data['total_controls'] = Control.objects.count()
        
        elif user.is_instructor:
            data['my_subjects'] = Subject.objects.filter(instructor=user).count()
            data['my_courses'] = Course.objects.filter(created_by=user).count()
            data['my_controls'] = Control.objects.filter(created_by=user).count()
            data['pending_submissions'] = TraineeSubmission.objects.filter(
                control__subject__instructor=user,
                status='pending'
            ).count()
        
        elif user.is_trainee:
            data['my_progress'] = TrainingProgress.objects.filter(trainee=user).count()
            data['my_submissions'] = TraineeSubmission.objects.filter(trainee=user).count()
            data['my_research'] = ResearchSubmission.objects.filter(trainee=user).count()
        
        elif user.is_coordinator or user.is_supervisor:
            data['total_trainees'] = TrainingProgress.objects.values('trainee').distinct().count()
            data['completed_training'] = TrainingProgress.objects.filter(
                part_4_completed=True
            ).count()
        
        return Response(data)
