from rest_framework import serializers
from .models import CustomUser
from django.contrib.auth.password_validation import validate_password
# from django.core.exceptions import ValidationError # Not explicitly used, but good practice if custom validation needed it.

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True, label="Confirm password")

    class Meta:
        model = CustomUser
        fields = ('username', 'email', 'password', 'password2', 'first_name', 'last_name', 'role')
        extra_kwargs = {
            'first_name': {'required': False, 'allow_blank': True},
            'last_name': {'required': False, 'allow_blank': True},
            'role': {'required': False}
        }

    def validate_email(self, value):
        if CustomUser.objects.filter(email=value.lower()).exists(): # Check lowercase email
            raise serializers.ValidationError("User with this email already exists.")
        return value.lower() # Store email as lowercase

    def validate_username(self, value):
        if CustomUser.objects.filter(username=value).exists():
            raise serializers.ValidationError("User with this username already exists.")
        return value

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs

    def create(self, validated_data):
        validated_data.pop('password2')
        # Ensure email is passed to create_user as it's the USERNAME_FIELD
        user = CustomUser.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'], # email is USERNAME_FIELD
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            role=validated_data.get('role', 'parent')
        )
        return user

class UserDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'role', 'date_joined', 'last_login')
