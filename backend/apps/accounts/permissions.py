#backend/apps/accounts/permissions.py
from rest_framework import permissions

class IsSuperAdmin(permissions.BasePermission):
    """
    Autorise uniquement les Super Admin à accéder à la vue.
    """
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role and request.user.role.name == "Super Admin"


class IsSameSchoolOrSuperAdmin(permissions.BasePermission):
    """
    Autorise l'accès à un objet uniquement si l'utilisateur est dans la même école
    ou s'il est Super Admin.
    """

    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role is not None

    def has_object_permission(self, request, view, obj):
        # Super Admin a accès à tout
        if request.user.role.name == "Super Admin":
            return True

        # Cas général pour les objets avec un champ school
        obj_school = getattr(obj, 'school', None)
        return obj_school == request.user.school
