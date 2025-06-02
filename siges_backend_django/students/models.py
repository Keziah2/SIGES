from django.db import models
from django.conf import settings
from schools.models import SchoolClass # Import SchoolClass

class Student(models.Model):
    GENDER_CHOICES = [
        ('MALE', 'Masculin'),
        ('FEMALE', 'Féminin'),
        ('OTHER', 'Autre'),
    ]
    STATUS_CHOICES = [
        ('ACTIVE', 'Actif'),
        ('INACTIVE', 'Inactif'),
        ('GRADUATED', 'Diplômé(e)'),
        ('TRANSFERRED_OUT', 'Transféré(e) (Sortant)'),
    ]

    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    date_of_birth = models.DateField()
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES)
    
    address = models.TextField(blank=True, null=True)
    emergency_contact_name = models.CharField(max_length=150, blank=True, null=True)
    emergency_contact_phone = models.CharField(max_length=20, blank=True, null=True)
    photo_url = models.URLField(max_length=255, blank=True, null=True)

    # Relation to the class (which determines school, level, year)
    school_class = models.ForeignKey(SchoolClass, related_name='students', on_delete=models.PROTECT)

    parents = models.ManyToManyField(
        settings.AUTH_USER_MODEL,
        related_name='children',
        limit_choices_to={'role': 'parent'},
        blank=True 
    )

    enrollment_date = models.DateField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='ACTIVE')

    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.school_class.name})"

    class Meta:
        ordering = ['last_name', 'first_name']
