from rest_framework import serializers
from .models import Student
from schools.models import SchoolClass # Required for PrimaryKeyRelatedField queryset
from users.models import CustomUser # Required for PrimaryKeyRelatedField queryset for parents
# from schools.serializers import SchoolClassSerializer # For detailed class info (read-only)
# from users.serializers import UserDetailSerializer # For detailed parent info (read-only)

class StudentSerializer(serializers.ModelSerializer):
    # school_class_details = SchoolClassSerializer(source='school_class', read_only=True)
    # parents_details = UserDetailSerializer(source='parents', many=True, read_only=True)

    # Explicitly define related fields for more control if needed, e.g., custom querysets for write ops
    school_class = serializers.PrimaryKeyRelatedField(queryset=SchoolClass.objects.all())
    parents = serializers.PrimaryKeyRelatedField(queryset=CustomUser.objects.filter(role='parent'), many=True, required=False)


    class Meta:
        model = Student
        fields = [
            'id', 'first_name', 'last_name', 'date_of_birth', 'gender',
            'address', 'emergency_contact_name', 'emergency_contact_phone',
            'photo_url', 'school_class', 'parents', 'enrollment_date', 'status',
            # 'school_class_details', 'parents_details' 
        ]
        read_only_fields = ['enrollment_date'] 

    # def validate_parents(self, value):
    #     for parent_user in value:
    #         if parent_user.role != 'parent': # Accessing .role might need the user object, not just ID
    #             raise serializers.ValidationError(f"User {parent_user} is not a parent.")
    #     return value
