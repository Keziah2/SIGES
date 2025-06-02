from rest_framework import serializers
from .models import School, Level, SchoolClass
from users.models import CustomUser # Nécessaire si on utilise PrimaryKeyRelatedField avec queryset explicite

class SchoolSerializer(serializers.ModelSerializer):
    class Meta:
        model = School
        fields = ['id', 'name', 'address', 'contact_info', 'director', 'logo_url', 'is_active']
        extra_kwargs = {
            'director': {
                'required': False, 
                'allow_null': True,
                'queryset': CustomUser.objects.filter(role='director') # Ensure only directors can be assigned
            }
        }

class LevelSerializer(serializers.ModelSerializer):
    # school = serializers.PrimaryKeyRelatedField(queryset=School.objects.all(), required=False) 
    # School will be set in the view based on URL or user (director) context for POST
    # For GET, it will be serialized based on the model instance.
    
    class Meta:
        model = Level
        fields = ['id', 'name', 'school', 'cycle']
        read_only_fields = ['school'] # School is typically set by the view context, not directly by client on POST/PUT to /levels/

    def validate(self, data):
        # Contextual validation if school is part of the input data (e.g. for super_admin_group)
        # For directors, the view usually limits creation to their school.
        user = self.context['request'].user
        school = data.get('school') # This would be if 'school' was writable and present in input

        if not school and self.instance: # For updates, if school is not being changed
            school = self.instance.school
        elif not school and 'school_id' in self.context.get('view_kwargs', {}): # if school_id in URL
             school_id_from_url = self.context['view_kwargs']['school_id']
             school = School.objects.get(pk=school_id_from_url)


        if user.role == 'director':
            if school and not user.directed_schools.filter(pk=school.pk).exists():
                raise serializers.ValidationError("You can only manage levels for your own school(s).")
            if not school and self.context['request'].method == 'POST': # If creating and school not determined
                 raise serializers.ValidationError("School must be specified for director.")
        return data


class SchoolClassSerializer(serializers.ModelSerializer):
    # level = serializers.PrimaryKeyRelatedField(queryset=Level.objects.all())
    # Level will be set in the view for POST requests to nested URL, or part of data for direct POST to /classes/
    class Meta:
        model = SchoolClass
        fields = ['id', 'name', 'level', 'academic_year']
        read_only_fields = ['level'] # Level is typically set by the view context

    def validate(self, data):
        # Similar to LevelSerializer, validate based on context
        user = self.context['request'].user
        level = data.get('level') # If 'level' is writable and present in input

        if not level and self.instance: # For updates
            level = self.instance.level
        elif not level and 'level_id' in self.context.get('view_kwargs', {}): # if level_id in URL
            level_id_from_url = self.context['view_kwargs']['level_id']
            level = Level.objects.get(pk=level_id_from_url)

        if user.role == 'director':
            if level and not user.directed_schools.filter(levels=level).exists():
                 raise serializers.ValidationError("You can only manage classes for levels in your own school(s).")
            if not level and self.context['request'].method == 'POST':
                 raise serializers.ValidationError("Level must be specified for director.")
        return data

