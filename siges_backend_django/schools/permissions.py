from rest_framework import permissions
from .models import Level, SchoolClass # Import models for isinstance check

class IsSuperAdminGroup(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and hasattr(request.user, 'role') and request.user.role == 'super_admin_group'

class IsDirector(permissions.BasePermission): # Generally for view-level checks if a user IS a director
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and hasattr(request.user, 'role') and request.user.role == 'director'

class IsDirectorOfSchoolOrSuperAdminGroup(permissions.BasePermission): # For School objects
    def has_object_permission(self, request, view, obj): 
        if request.method in permissions.SAFE_METHODS: 
            return True 
        if not (request.user and request.user.is_authenticated and hasattr(request.user, 'role')):
            return False
        if request.user.role == 'super_admin_group':
            return True
        # obj is a School instance
        return request.user.role == 'director' and obj.director == request.user

class CanManageSchoolContent(permissions.BasePermission): # For Level and SchoolClass objects
    def has_permission(self, request, view): 
        if not (request.user and request.user.is_authenticated and hasattr(request.user, 'role')):
            return False
        if request.user.role == 'super_admin_group':
            return True
        if request.user.role == 'director':
            # For POST (create), school/level context is usually set by the view (e.g., from URL or request.data)
            # This permission alone can't fully gate creation for directors without view context.
            # The view's perform_create or serializer validation should enforce director's school ownership.
            return True 
        return False 

    def has_object_permission(self, request, view, obj): 
        if not (request.user and request.user.is_authenticated and hasattr(request.user, 'role')):
            return False
        if request.user.role == 'super_admin_group':
            return True
        
        school_of_object = None
        if isinstance(obj, Level):
            school_of_object = obj.school
        elif isinstance(obj, SchoolClass):
            school_of_object = obj.level.school
        
        if school_of_object and request.user.role == 'director':
            # Check if the object's school is one of the schools directed by the user
            return request.user.directed_schools.filter(pk=school_of_object.pk).exists()
        return False
