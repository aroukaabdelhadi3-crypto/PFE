from rest_framework import permissions


class IsInstructorOrAdmin(permissions.BasePermission):
    """Allow only instructors and admins."""
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and (
            request.user.is_instructor or request.user.is_admin
        )


class IsCoordinatorOrSupervisor(permissions.BasePermission):
    """Allow only coordinators and supervisors."""
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and (
            request.user.is_coordinator or request.user.is_supervisor or request.user.is_admin
        )


class IsInstructor(permissions.BasePermission):
    """Allow only instructors."""
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.is_instructor


class IsCoordinator(permissions.BasePermission):
    """Allow only coordinators."""
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.is_coordinator


class IsSupervisor(permissions.BasePermission):
    """Allow only supervisors."""
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.is_supervisor
