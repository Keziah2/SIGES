#backend/apps/accounts/views.py
from rest_framework import viewsets, permissions
from .models import User, Role
from .serializers import UserSerializer, RoleSerializer
from .permissions import IsSuperAdmin, IsSameSchoolOrSuperAdmin


class RoleViewSet(viewsets.ModelViewSet):
    queryset = Role.objects.all()
    serializer_class = RoleSerializer
    permission_classes = [permissions.IsAuthenticated, IsSuperAdmin]


class UserViewSet(viewsets.ModelViewSet):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated, IsSameSchoolOrSuperAdmin]

    def get_queryset(self):
        user = self.request.user
        if user.role and user.role.name == "Super Admin":
            return User.objects.all()
        return User.objects.filter(school=user.school)

    def perform_create(self, serializer):
        user = self.request.user
        if user.role and user.role.name != "Super Admin":
            serializer.save(school=user.school)
        else:
            serializer.save()
