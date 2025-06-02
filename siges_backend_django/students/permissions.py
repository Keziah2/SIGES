from rest_framework import permissions
from schools.permissions import IsSuperAdminGroup 

class CanManageSchoolStudents(permissions.BasePermission):
    def has_permission(self, request, view): 
        if not (request.user and request.user.is_authenticated and hasattr(request.user, 'role')):
            return False
        
        if request.user.role == 'super_admin_group':
            return True
        
        if request.user.role == 'director': 
            return True
            
        if request.user.role == 'parent' and request.method in permissions.SAFE_METHODS: 
            return True
            
        return False

    def has_object_permission(self, request, view, obj): # obj is a Student instance
        if not (request.user and request.user.is_authenticated and hasattr(request.user, 'role')):
            return False

        if request.user.role == 'super_admin_group':
            return True

        if request.user.role == 'director':
            # Check if the student's school_class's level's school is one directed by the user
            return request.user.directed_schools.filter(levels__classes__students=obj).exists()

        if request.user.role == 'parent':
            if request.method in permissions.SAFE_METHODS: 
                return obj.parents.filter(pk=request.user.pk).exists()
            return False 
        
        return False
