from django.db import models
from django.conf import settings

class School(models.Model):
    name = models.CharField(max_length=255)
    address = models.TextField()
    contact_info = models.CharField(max_length=100, blank=True, null=True)
    director = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='directed_school',
        limit_choices_to={'role': 'director'}
    )
    logo_url = models.URLField(max_length=200, blank=True, null=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.name
