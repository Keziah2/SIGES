from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import School, Level, SchoolClass
from .serializers import SchoolSerializer, LevelSerializer, SchoolClassSerializer
from .permissions import IsSuperAdminGroup, IsDirectorOfSchoolOrSuperAdminGroup, CanManageSchoolContent, IsDirector

class SchoolViewSet(viewsets.ModelViewSet):
    queryset = School.objects.all().order_by('name')
    serializer_class = SchoolSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            permission_classes = [permissions.IsAuthenticated]
        elif self.action == 'create':
            permission_classes = [IsSuperAdminGroup]
        elif self.action in ['update', 'partial_update', 'destroy']:
            permission_classes = [IsDirectorOfSchoolOrSuperAdminGroup]
        elif self.action == 'levels': # Permissions for custom @action 'levels'
            if self.request.method == 'POST':
                permission_classes = [CanManageSchoolContent] # or more specific: IsDirectorOfSchoolOrSuperAdminGroup for the school object
            else: # GET
                permission_classes = [permissions.IsAuthenticated]
        else:
            permission_classes = [permissions.IsAdminUser]
        return [permission() for permission in permission_classes]

    @action(detail=True, methods=['get', 'post'], url_path='levels')
    def levels(self, request, pk=None):
        school = self.get_object() 
        # self.check_object_permissions(request, school) # Check perms on school for POST if needed by CanManageSchoolContent logic for POST
        
        if request.method == 'GET':
            levels = Level.objects.filter(school=school).order_by('name')
            serializer = LevelSerializer(levels, many=True, context={'request': request, 'view_kwargs': {'school_id': school.pk}})
            return Response(serializer.data)
        
        elif request.method == 'POST':
            # Permission check for POST should ensure user can add level to *this* school
            if request.user.role == 'director' and not request.user.directed_schools.filter(pk=school.pk).exists():
                 return Response({'detail': 'You do not have permission to add a level to this school.'}, status=status.HTTP_403_FORBIDDEN)
            if request.user.role != 'super_admin_group' and request.user.role != 'director': # Redundant if CanManageSchoolContent is strict
                 return Response({'detail': 'Permission denied.'}, status=status.HTTP_403_FORBIDDEN)

            serializer = LevelSerializer(data=request.data, context={'request': request, 'view_kwargs': {'school_id': school.pk}})
            if serializer.is_valid():
                serializer.save(school=school) 
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LevelViewSet(viewsets.ModelViewSet):
    serializer_class = LevelSerializer
    permission_classes = [CanManageSchoolContent] # Global permission for the ViewSet

    def get_queryset(self):
        user = self.request.user
        if user.role == 'super_admin_group':
            qs = Level.objects.all()
        elif user.role == 'director':
            qs = Level.objects.filter(school__in=user.directed_schools.all())
        else:
            return Level.objects.none() 

        school_id = self.request.query_params.get('school_id')
        if school_id: # Allow filtering for both super_admin_group and directors (if they have multiple schools)
            qs = qs.filter(school_id=school_id)
        return qs.order_by('school__name', 'name')

    def perform_create(self, serializer):
        # School needs to be determined for creation.
        # SuperAdminGroup must provide school_id in request.data.
        # Director can only create for their own school(s). If they direct multiple, school_id is needed.
        # If they direct one, it can be inferred.
        school_id_from_data = serializer.validated_data.get('school_id', self.request.data.get('school'))

        if self.request.user.role == 'super_admin_group':
            if not school_id_from_data:
                raise serializers.ValidationError({'school': 'School ID must be provided for Super Admin.'})
            school = get_object_or_404(School, pk=school_id_from_data)
            serializer.save(school=school)
        elif self.request.user.role == 'director':
            director_schools = self.request.user.directed_schools.all()
            if not director_schools.exists():
                raise permissions.PermissionDenied("You are not a director of any school.")

            if school_id_from_data:
                school = get_object_or_404(director_schools, pk=school_id_from_data) # Ensures director owns the school
            elif len(director_schools) == 1:
                school = director_schools.first()
            else:
                raise serializers.ValidationError({'school': 'School ID must be provided if you direct multiple schools.'})
            serializer.save(school=school)
        else:
            raise permissions.PermissionDenied("You do not have permission to create a level.")
    
    @action(detail=True, methods=['get', 'post'], url_path='classes')
    def classes(self, request, pk=None):
        level = self.get_object() # pk is level_id
        # self.check_object_permissions(request, level) # Already handled by CanManageSchoolContent for the level object

        if request.method == 'GET':
            classes = SchoolClass.objects.filter(level=level).order_by('name')
            serializer = SchoolClassSerializer(classes, many=True, context={'request': request, 'view_kwargs': {'level_id': level.pk}})
            return Response(serializer.data)
        
        elif request.method == 'POST':
            # Permission check for POST should ensure user can add class to *this* level
            # (which implies permissions on the school of the level)
            # CanManageSchoolContent on Level object already verified this.
            serializer = SchoolClassSerializer(data=request.data, context={'request': request, 'view_kwargs': {'level_id': level.pk}})
            if serializer.is_valid():
                serializer.save(level=level) 
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class SchoolClassViewSet(viewsets.ModelViewSet):
    serializer_class = SchoolClassSerializer
    permission_classes = [CanManageSchoolContent]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'super_admin_group':
            qs = SchoolClass.objects.all()
        elif user.role == 'director':
            qs = SchoolClass.objects.filter(level__school__in=user.directed_schools.all())
        else:
            return SchoolClass.objects.none()

        level_id = self.request.query_params.get('level_id')
        if level_id: 
            qs = qs.filter(level_id=level_id)
        return qs.order_by('level__school__name', 'level__name', 'name')

    def perform_create(self, serializer):
        # Level needs to be determined for creation.
        level_id_from_data = serializer.validated_data.get('level_id', self.request.data.get('level'))
        if not level_id_from_data:
            raise serializers.ValidationError({'level': 'Level ID must be provided.'})
        
        level = get_object_or_404(Level, pk=level_id_from_data)

        if self.request.user.role == 'super_admin_group':
            serializer.save(level=level)
        elif self.request.user.role == 'director':
            if not self.request.user.directed_schools.filter(levels=level).exists(): # Check if level belongs to one of director's schools
                raise permissions.PermissionDenied("You cannot create a class for this level.")
            serializer.save(level=level)
        else:
            raise permissions.PermissionDenied("You do not have permission to create a class.")
