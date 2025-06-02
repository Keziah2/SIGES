from rest_framework import permissions

class IsSuperAdminGroup(permissions.BasePermission):
    """
    Allows access only to users with the 'super_admin_group' role.
    """
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and hasattr(request.user, 'role') and request.user.role == 'super_admin_group'

class IsDirector(permissions.BasePermission):
    """
    Allows access only to users with the 'director' role.
    """
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and hasattr(request.user, 'role') and request.user.role == 'director'

class IsDirectorOfSchoolOrSuperAdminGroup(permissions.BasePermission):
    """
    Allows super_admin_group to do anything.
    Allows directors to modify/delete only their own school.
    Read is allowed for any authenticated user.
    """
    def has_object_permission(self, request, view, obj):
        # SAFE_METHODS are GET, HEAD, OPTIONS
        if request.method in permissions.SAFE_METHODS:
            return True # Allow read for any authenticated user (permissions stack)

        if not request.user or not request.user.is_authenticated:
            return False

        if hasattr(request.user, 'role') and request.user.role == 'super_admin_group':
            return True

        # obj is the School instance
        if hasattr(request.user, 'role') and request.user.role == 'director':
            return obj.director == request.user

        return False
