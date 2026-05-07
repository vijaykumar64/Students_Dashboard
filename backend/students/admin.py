"""
Admin Panel Configuration.

Register the Student model so it appears in Django's built-in admin
at http://127.0.0.1:8000/admin/

This allows you to browse, search, and filter student records
through a nice web interface without writing any code.

To create a superuser (admin account), run:
  python manage.py createsuperuser
"""

from django.contrib import admin
from .models import Student


@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    """Customizes how Student records appear in the admin panel."""

    # Columns shown in the list view
    list_display = ['student_id', 'name', 'age', 'gender', 'department', 'semester', 'gpa']

    # Fields you can click to search
    search_fields = ['student_id', 'name', 'department']

    # Right-side filter panel
    list_filter = ['department', 'gender', 'semester']

    # Make GPA and semester sortable by clicking column header
    ordering = ['student_id']

    # Number of records per page in admin
    list_per_page = 25
