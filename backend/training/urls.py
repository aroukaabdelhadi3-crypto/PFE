from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    SubjectViewSet, CourseViewSet, ControlViewSet,
    SubmissionViewSet, CorrectionViewSet,
    ResearchTopicViewSet, ResearchSubmissionViewSet,
    TrainingProgressViewSet, DashboardView
)

router = DefaultRouter()
router.register('subjects', SubjectViewSet)
router.register('courses', CourseViewSet)
router.register('controls', ControlViewSet)
router.register('submissions', SubmissionViewSet)
router.register('corrections', CorrectionViewSet)
router.register('research', ResearchTopicViewSet)
router.register('research-submissions', ResearchSubmissionViewSet)
router.register('progress', TrainingProgressViewSet)
router.register('dashboard', DashboardView, basename='dashboard')

urlpatterns = [
    path('', include(router.urls)),
]
