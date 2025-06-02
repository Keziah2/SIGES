#backend/apps/accounts/permissions.py
from rest_framework import permissions

class IsSuperAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role and request.user.role.name == "Super Admin"


class IsSameSchoolOrSuperAdmin(permissions.BasePermission):
    """
    Permet à un utilisateur de voir/éditer uniquement les utilisateurs de sa propre école
    sauf s'il est Super Admin.
    """
    def has_object_permission(self, request, view, obj):
        return (
            request.user.role and request.user.role.name == "Super Admin"
        ) or (
            obj.school == request.user.school
        )
