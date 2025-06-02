from django.contrib import admin
from .models import Student

@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = ('first_name', 'last_name', 'display_school_class', 'status', 'enrollment_date')
    list_filter = ('status', 'school_class__level__school__name', 'school_class__level__name', 'school_class__academic_year')
    search_fields = ('first_name', 'last_name', 'school_class__name', 'parents__email', 'parents__username')
    filter_horizontal = ('parents',) 
    readonly_fields = ('enrollment_date',)
    fieldsets = (
        (None, {
            'fields': ('first_name', 'last_name', 'date_of_birth', 'gender', 'photo_url')
        }),
        ('School Information', {
            'fields': ('school_class', 'status', 'enrollment_date')
        }),
        ('Contact & Address', {
            'fields': ('address', 'emergency_contact_name', 'emergency_contact_phone')
        }),
        ('Parents/Guardians', {
            'fields': ('parents',)
        }),
    )
    autocomplete_fields = ['school_class', 'parents'] # For easier selection in admin

    def display_school_class(self, obj):
        if obj.school_class:
            return f"{obj.school_class.name} ({obj.school_class.level.name} - {obj.school_class.level.school.name})"
        return None
    display_school_class.short_description = 'Class (Level - School)'
    display_school_class.admin_order_field = 'school_class__name'

