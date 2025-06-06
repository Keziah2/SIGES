# Generated by Django 5.2.1 on 2025-06-02 09:52

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('schools', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AddField(
            model_name='school',
            name='director',
            field=models.ForeignKey(blank=True, limit_choices_to={'role': 'director'}, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='directed_school', to=settings.AUTH_USER_MODEL),
        ),
    ]
