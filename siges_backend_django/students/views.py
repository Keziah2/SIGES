from rest_framework import viewsets, permissions, serializers
from django.db.models import Q
from .models import Student
from .serializers import StudentSerializer
from .permissions import CanManageSchoolStudents
from schools.models import SchoolClass 

class StudentViewSet(viewsets.ModelViewSet):
    serializer_class = StudentSerializer
    permission_classes = [CanManageSchoolStudents] 

    def get_queryset(self):
        user = self.request.user
        # Start with a base queryset that includes related data for efficiency
        queryset = Student.objects.select_related('school_class__level__school').prefetch_related('parents').all()

        if not hasattr(user, 'role'): 
            return Student.objects.none()

        if user.role == 'super_admin_group':
            school_id = self.request.query_params.get('school_id')
            class_id = self.request.query_params.get('class_id')
            level_id = self.request.query_params.get('level_id')

            if class_id:
                queryset = queryset.filter(school_class_id=class_id)
            elif level_id:
                queryset = queryset.filter(school_class__level_id=level_id)
            elif school_id:
                queryset = queryset.filter(school_class__level__school_id=school_id)
            return queryset.order_by('school_class__level__school__name', 'school_class__level__name', 'school_class__name', 'last_name', 'first_name')


        elif user.role == 'director':
            # Director sees students from all schools they direct
            return queryset.filter(school_class__level__school__director=user).order_by('school_class__level__name', 'school_class__name', 'last_name', 'first_name')


        elif user.role == 'parent':
            return queryset.filter(parents=user).order_by('school_class__name', 'last_name', 'first_name')
        
        return Student.objects.none()

    def perform_create(self, serializer):
        user = self.request.user
        school_class_id = self.request.data.get('school_class') # Get ID from request data

        if not school_class_id:
             raise serializers.ValidationError({"school_class": "SchoolClass ID must be provided."})

        try:
            s_class = SchoolClass.objects.select_related('level__school').get(pk=school_class_id)
        except SchoolClass.DoesNotExist:
            raise serializers.ValidationError({"school_class": "Invalid SchoolClass ID."})

        if user.role == 'director':
            if not user.directed_schools.filter(pk=s_class.level.school.pk).exists():
                raise permissions.PermissionDenied("You can only add students to classes in your school(s).")
            serializer.save()
        elif user.role == 'super_admin_group':
             serializer.save() 
        else:
            raise permissions.PermissionDenied("You do not have permission to create students.")

    def perform_update(self, serializer):
        # Similar permission checks can be added for updates if school_class can be changed
        # For now, rely on has_object_permission for student instance,
        # but changing school_class might need explicit check like in perform_create.
        user = self.request.user
        school_class_id = self.request.data.get('school_class') # Get ID from request data
        
        # If school_class is being changed, validate the new class
        if school_class_id and school_class_id != serializer.instance.school_class_id:
            try:
                s_class = SchoolClass.objects.select_related('level__school').get(pk=school_class_id)
            except SchoolClass.DoesNotExist:
                raise serializers.ValidationError({"school_class": "Invalid new SchoolClass ID."})

            if user.role == 'director':
                 if not user.directed_schools.filter(pk=s_class.level.school.pk).exists():
                    raise permissions.PermissionDenied("You can only move students to classes in your school(s).")
            elif user.role != 'super_admin_group': # If not director and not super_admin
                raise permissions.PermissionDenied("You do not have permission to change student's class to this one.")
        
        serializer.save()

