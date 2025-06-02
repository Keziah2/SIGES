from rest_framework import serializers
from .models import School
# from users.models import CustomUser # Import CustomUser if using PrimaryKeyRelatedField with queryset
# from django.conf import settings # Or use settings.AUTH_USER_MODEL

class SchoolSerializer(serializers.ModelSerializer):
    # director_id = serializers.PrimaryKeyRelatedField(
    #     queryset=CustomUser.objects.filter(role='director'), # Make sure CustomUser is imported
    #     source='director', # Map this field to the 'director' model field
    #     write_only=True,
    #     required=False,
    #     allow_null=True
    # )
    # # For read operations, you might want to display more director info
    # director = UserDetailSerializer(read_only=True) # Assuming UserDetailSerializer exists in users.serializers

    class Meta:
        model = School
        fields = ['id', 'name', 'address', 'contact_info', 'director', 'logo_url', 'is_active']
        extra_kwargs = {
            'director': {
                'required': False,
                'allow_null': True,
                # If your CustomUser model is not yet available at compile time for queryset,
                # you might need to set the queryset dynamically in __init__ or use slugs.
                # For simplicity, if 'director' is just a ForeignKey to AUTH_USER_MODEL,
                # DRF handles it as a PrimaryKeyRelatedField by default.
                # Explicitly setting it helps control behavior, e.g. filtering choices for 'director' role.
            }
        }
