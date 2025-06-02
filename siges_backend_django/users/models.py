from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.translation import gettext_lazy as _

class CustomUser(AbstractUser):
    email = models.EmailField(_('email address'), unique=True)
    ROLE_CHOICES = [
        ('admin', 'Admin'),
        ('director', 'Director'),
        ('teacher', 'Teacher'),
        ('parent', 'Parent'),
        ('accountant', 'Accountant'),
        ('super_admin_group', 'Super Admin Group'),
    ]
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='parent')
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return self.email
