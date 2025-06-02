from django.contrib import admin
from .models import School, Level, SchoolClass

@admin.register(School)
class SchoolAdmin(admin.ModelAdmin):
    list_display = ('name', 'address', 'director', 'is_active')
    list_filter = ('is_active',)
    search_fields = ('name', 'director__email')

@admin.register(Level)
class LevelAdmin(admin.ModelAdmin):
    list_display = ('name', 'school', 'cycle')
    list_filter = ('school__name', 'cycle') # Filter by school name for better usability
    search_fields = ('name', 'school__name')
    ordering = ('school__name', 'name')

@admin.register(SchoolClass)
class SchoolClassAdmin(admin.ModelAdmin):
    list_display = ('name', 'level_display', 'academic_year')
    list_filter = ('level__school__name', 'level__name', 'academic_year')
    search_fields = ('name', 'level__name', 'academic_year')
    ordering = ('level__school__name', 'level__name', 'name')

    def level_display(self, obj):
        return f"{obj.level.name} ({obj.level.school.name})"
    level_display.short_description = "Level (School)"
    level_display.admin_order_field = 'level__name' # Allows sorting by level name
