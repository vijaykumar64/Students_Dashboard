"""
Main URL Configuration for the Django Backend.

URL routing works like a traffic cop:
  - /admin/         → Django's built-in admin panel
  - /api/           → All our REST API endpoints (forwarded to students/urls.py)
  - /api/students/  → Student list, search, filter, sort
  - /api/students/<id>/ → Single student detail

Flow: Browser/React → urls.py → students/urls.py → views.py → serializers.py → DB
"""

from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    # Django admin panel at http://127.0.0.1:8000/admin/
    path('admin/', admin.site.urls),

    # All student API routes at http://127.0.0.1:8000/api/
    # The actual routes are defined in students/urls.py
    path('api/', include('students.urls')),
]
