"""
Student Model — mirrors the existing 'students' table in students.db.

KEY POINT: managed = False
  - Django will NOT create, modify, or delete this database table.
  - We're connecting to an already-existing table.
  - Django ORM (queries like Student.objects.all()) still works perfectly.
  - This is the correct approach when the DB already has data.

Table columns match exactly:
  student_id | name | age | gender | department | semester | gpa
"""

from django.db import models


class Student(models.Model):
    # Primary key — TEXT field like 'S001', 'S002' etc.
    student_id = models.CharField(max_length=20, primary_key=True)

    # Student's full name
    name = models.CharField(max_length=100)

    # Age as integer
    age = models.IntegerField()

    # 'Male' or 'Female'
    gender = models.CharField(max_length=10)

    # Department: CSE, ECE, IT, EEE, MECH, CIVIL
    department = models.CharField(max_length=50)

    # Current semester (1-8)
    semester = models.IntegerField()

    # Grade Point Average (0.0 - 10.0)
    gpa = models.FloatField()

    class Meta:
        # CRITICAL: Do NOT let Django manage (create/alter/drop) this table.
        # The table already exists in students.db with existing data.
        managed = False

        # Must exactly match the SQLite table name
        db_table = 'students'

        # Default ordering by student_id
        ordering = ['student_id']

        # Indexes speed up search/filter queries on commonly queried fields.
        # These are declared here for documentation; since managed=False,
        # Django won't create them — run the SQL below manually if needed:
        #   CREATE INDEX idx_students_name ON students(name);
        #   CREATE INDEX idx_students_dept ON students(department);
        #   CREATE INDEX idx_students_gpa  ON students(gpa);
        indexes = [
            models.Index(fields=['name'],       name='idx_students_name'),
            models.Index(fields=['department'], name='idx_students_dept'),
            models.Index(fields=['gpa'],        name='idx_students_gpa'),
        ]

    def __str__(self):
        return f"{self.student_id} - {self.name} ({self.department})"
