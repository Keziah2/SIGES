from rest_framework import viewsets, permissions
from .models import School
from .serializers import SchoolSerializer
from .permissions import IsSuperAdminGroup, IsDirectorOfSchoolOrSuperAdminGroup # Removed IsDirector as it's covered or too broad here

class SchoolViewSet(viewsets.ModelViewSet):
    queryset = School.objects.all().order_by('name') # Added default ordering
    serializer_class = SchoolSerializer

    def get_permissions(self):
        """
        Instantiates and returns the list of permissions that this view requires.
        """
        if self.action == 'list' or self.action == 'retrieve':
            # Any authenticated user can list or retrieve schools.
            permission_classes = [permissions.IsAuthenticated]
        elif self.action == 'create':
            # Only SuperAdminGroup can create a school.
            permission_classes = [IsSuperAdminGroup]
        elif self.action in ['update', 'partial_update', 'destroy']:
            # Only SuperAdminGroup or the director of the specific school can modify/delete.
            permission_classes = [IsDirectorOfSchoolOrSuperAdminGroup]
        else:
            # For any other actions, default to admin only or deny.
            permission_classes = [permissions.IsAdminUser]
        return [permission() for permission in permission_classes]

    # perform_create and get_queryset are commented out as per original script, can be refined later.
