from django.contrib import admin
from .models import School

class SchoolAdmin(admin.ModelAdmin):
    list_display = ('name', 'address', 'director', 'is_active')
    list_filter = ('is_active',)
    search_fields = ('name', 'director__email')

admin.site.register(School, SchoolAdmin)
