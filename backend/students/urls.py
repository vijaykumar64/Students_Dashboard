"""
URL Configuration for the Students App.

DRF Router automatically creates these URL patterns:
  GET  /api/students/              → list all students (paginated)
  GET  /api/students/<id>/         → single student detail
  GET  /api/students/departments/  → unique department list
  GET  /api/students/stats/        → dashboard statistics

The router.register() call handles all the routing magic.
"""

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import StudentViewSet

# DefaultRouter automatically generates RESTful URL patterns
router = DefaultRouter()
router.register(r'students', StudentViewSet, basename='student')

urlpatterns = [
    # Include all router-generated URLs
    # This gives us /api/students/, /api/students/<pk>/, etc.
    path('', include(router.urls)),
]
