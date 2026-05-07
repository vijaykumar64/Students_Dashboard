"""
Serializers — convert Student model objects into JSON (and back).

Think of a serializer like a translator:
  Python Object  →  JSON  (for sending to React frontend)
  JSON          →  Python Object  (for receiving data from frontend)

ModelSerializer automatically creates fields from the model,
so we don't have to manually define each field.
"""

from rest_framework import serializers
from .models import Student


class StudentSerializer(serializers.ModelSerializer):
    """
    Converts a Student model instance to JSON like:
    {
        "student_id": "S001",
        "name": "Aarav Sharma",
        "age": 20,
        "gender": "Male",
        "department": "CSE",
        "semester": 4,
        "gpa": 8.2
    }
    """

    class Meta:
        model = Student
        # Include all fields from the Student model
        fields = [
            'student_id',
            'name',
            'age',
            'gender',
            'department',
            'semester',
            'gpa',
        ]


