from django.db import models
from django.conf import settings # Pour lier à CustomUser

class School(models.Model):
    name = models.CharField(max_length=255)
    address = models.TextField()
    contact_info = models.CharField(max_length=100, blank=True, null=True)
    director = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='directed_schools', # 'directed_schools' pour refléter qu'un directeur peut en avoir plusieurs (théoriquement)
        limit_choices_to={'role': 'director'}
    )
    logo_url = models.URLField(max_length=200, blank=True, null=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.name

class Level(models.Model):
    CYCLE_CHOICES = [
        ('PRESCHOOL', 'Préscolaire'),
        ('PRIMARY', 'Primaire'),
        # Ajouter d'autres cycles si nécessaire selon le CdC complet
    ]
    name = models.CharField(max_length=100) # Ex: CP1, CE2, CM2
    school = models.ForeignKey(School, related_name='levels', on_delete=models.CASCADE)
    cycle = models.CharField(max_length=20, choices=CYCLE_CHOICES, default='PRIMARY')

    class Meta:
        unique_together = ('name', 'school') # Un niveau est unique par nom au sein d'une école
        ordering = ['school', 'name']

    def __str__(self):
        return f"{self.name} ({self.school.name})"

class SchoolClass(models.Model): # Renommé pour éviter conflit avec 'class'
    name = models.CharField(max_length=100) # Ex: CM2 A, CE1 B
    level = models.ForeignKey(Level, related_name='classes', on_delete=models.CASCADE)
    academic_year = models.CharField(max_length=9, help_text="Ex: 2023-2024") # Simple CharField pour MVP
    # teacher = models.ForeignKey(
    #     settings.AUTH_USER_MODEL,
    #     on_delete=models.SET_NULL,
    #     null=True,
    #     blank=True,
    #     related_name='taught_classes',
    #     limit_choices_to={'role': 'teacher'}
    # ) # Optionnel pour cette étape

    class Meta:
        verbose_name = "Class"
        verbose_name_plural = "Classes"
        unique_together = ('name', 'level', 'academic_year') # Une classe est unique par nom, niveau et année scolaire
        ordering = ['level__school__name', 'level__name', 'name'] # Corrected ordering for deeper relation


    def __str__(self):
        return f"{self.name} ({self.level.name} - {self.level.school.name} - {self.academic_year})"
