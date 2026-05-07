"""
Views — the core logic that handles API requests and returns responses.

Flow:
  React sends GET /api/students/?search=Aarav&department=CSE
      ↓
  Django router calls StudentViewSet.list()
      ↓
  get_queryset() filters/sorts/searches the Student DB records
      ↓
  Results are serialized (Python → JSON) by StudentSerializer
      ↓
  JSON response is sent back to React

ViewSet types:
  ReadOnlyModelViewSet → Only GET requests (list + retrieve)
  ModelViewSet → Full CRUD (GET, POST, PUT, PATCH, DELETE)
"""

from django.db.models import Avg, Count, Q, Case, When, IntegerField, FloatField
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination

from .models import Student
from .serializers import StudentSerializer


class StudentPagination(PageNumberPagination):
    """Custom pagination: 10 items per page, configurable via ?page_size=N."""
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100

    def get_page_size(self, request):
        """Reject negative or zero page_size values."""
        size = super().get_page_size(request)
        if size is not None and size <= 0:
            return self.page_size
        return size


class StudentViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for Student API endpoints.

    ReadOnlyModelViewSet provides:
      GET /api/students/           → list()    → all students (paginated)
      GET /api/students/<id>/      → retrieve() → single student

    Custom actions:
      GET /api/students/departments/ → list of unique departments
      GET /api/students/stats/       → dashboard statistics
    """

    serializer_class = StudentSerializer
    pagination_class = StudentPagination

    def get_queryset(self):
        """
        Build the queryset with optional filtering, searching, and sorting.

        Supported query parameters:
          ?search=Aarav           → name contains 'Aarav' (case-insensitive)
          ?department=CSE         → only CSE students
          ?gender=Female          → only female students
          ?semester=4             → only semester 4 students
          ?min_gpa=8.0            → GPA >= 8.0
          ?max_gpa=9.0            → GPA <= 9.0
          ?ordering=gpa           → sort ascending by GPA
          ?ordering=-gpa          → sort descending by GPA
          ?ordering=name          → sort by name
        """
        queryset = Student.objects.all()

        # ── Search by name ──────────────────────────────────────────────────
        search = self.request.query_params.get('search', '').strip()
        if search:
            # icontains = case-insensitive contains
            queryset = queryset.filter(
                Q(name__icontains=search) |
                Q(student_id__icontains=search)
            )

        # ── Filter by department ────────────────────────────────────────────
        department = self.request.query_params.get('department', '').strip()
        if department and department.lower() != 'all':
            queryset = queryset.filter(department__iexact=department)

        # ── Filter by gender ────────────────────────────────────────────────
        gender = self.request.query_params.get('gender', '').strip()
        if gender and gender.lower() != 'all':
            queryset = queryset.filter(gender__iexact=gender)

        # ── Filter by semester ──────────────────────────────────────────────
        semester = self.request.query_params.get('semester', '').strip()
        if semester:
            try:
                queryset = queryset.filter(semester=int(semester))
            except ValueError:
                pass

        # ── GPA range filtering ─────────────────────────────────────────────
        min_gpa = self.request.query_params.get('min_gpa', '').strip()
        max_gpa = self.request.query_params.get('max_gpa', '').strip()
        if min_gpa:
            try:
                queryset = queryset.filter(gpa__gte=float(min_gpa))
            except ValueError:
                pass
        if max_gpa:
            try:
                queryset = queryset.filter(gpa__lte=float(max_gpa))
            except ValueError:
                pass

        # ── Sorting / Ordering ──────────────────────────────────────────────
        # Valid sort fields (prefix '-' for descending)
        valid_orderings = {
            'gpa', '-gpa', 'name', '-name',
            'age', '-age', 'semester', '-semester',
            'student_id', '-student_id',
        }
        ordering = self.request.query_params.get('ordering', 'student_id').strip()
        if ordering in valid_orderings:
            queryset = queryset.order_by(ordering)

        return queryset

    def retrieve(self, request, *args, **kwargs):
        """
        GET /api/students/<student_id>/
        Returns a single student's full details.
        Returns 404 if student not found.
        """
        try:
            student = Student.objects.get(pk=kwargs['pk'])
            serializer = self.get_serializer(student)
            return Response(serializer.data)
        except Student.DoesNotExist:
            return Response(
                {'error': f"Student with ID '{kwargs['pk']}' not found."},
                status=status.HTTP_404_NOT_FOUND
            )

    @action(detail=False, methods=['get'], url_path='departments')
    def departments(self, request):
        """
        GET /api/students/departments/
        Returns list of all unique departments.

        Response: ["CIVIL", "CSE", "ECE", "EEE", "IT", "MECH"]
        """
        departments = (
            Student.objects
            .values_list('department', flat=True)
            .distinct()
            .order_by('department')
        )
        return Response(list(departments))

    @action(detail=False, methods=['get'], url_path='stats')
    def stats(self, request):
        """
        GET /api/students/stats/
        Returns dashboard statistics.

        Response:
        {
            "total_students": 100,
            "avg_gpa": 8.31,
            "department_count": 6,
            "gender_stats": {"Male": 55, "Female": 45},
            "dept_stats": [
                {"department": "CSE", "count": 20, "avg_gpa": 8.5},
                ...
            ],
            "gpa_distribution": {
                "7.0-7.5": 10, "7.5-8.0": 20, ...
            }
        }
        """
        # ── Single aggregation query for totals ────────────────────────────
        totals = Student.objects.aggregate(
            total=Count('student_id'),
            avg_gpa=Avg('gpa'),
            dept_count=Count('department', distinct=True),
        )
        total_students = totals['total']
        avg_gpa = round(totals['avg_gpa'], 2) if totals['avg_gpa'] else 0.0
        department_count = totals['dept_count']

        # Gender breakdown: {'Male': 55, 'Female': 45}
        gender_qs = (
            Student.objects
            .values('gender')
            .annotate(count=Count('student_id'))
        )
        gender_stats = {item['gender']: item['count'] for item in gender_qs}

        # Per-department stats
        dept_qs = (
            Student.objects
            .values('department')
            .annotate(
                count=Count('student_id'),
                avg_gpa=Avg('gpa')
            )
            .order_by('department')
        )
        dept_stats = [
            {
                'department': d['department'],
                'count': d['count'],
                'avg_gpa': round(d['avg_gpa'], 2),
            }
            for d in dept_qs
        ]

        # ── GPA distribution using DB aggregation (no Python loop over all rows) ──
        gpa_distribution_qs = Student.objects.aggregate(
            b_75_80=Count(Case(When(gpa__gte=7.5, gpa__lt=8.0, then=1), output_field=IntegerField())),
            b_80_85=Count(Case(When(gpa__gte=8.0, gpa__lt=8.5, then=1), output_field=IntegerField())),
            b_85_90=Count(Case(When(gpa__gte=8.5, gpa__lt=9.0, then=1), output_field=IntegerField())),
            b_90_95=Count(Case(When(gpa__gte=9.0, gpa__lte=9.5, then=1), output_field=IntegerField())),
        )
        gpa_distribution = {
            '7.5 - 8.0': gpa_distribution_qs['b_75_80'],
            '8.0 - 8.5': gpa_distribution_qs['b_80_85'],
            '8.5 - 9.0': gpa_distribution_qs['b_85_90'],
            '9.0 - 9.5': gpa_distribution_qs['b_90_95'],
        }

        return Response({
            'total_students': total_students,
            'avg_gpa': avg_gpa,
            'department_count': department_count,
            'gender_stats': gender_stats,
            'dept_stats': dept_stats,
            'gpa_distribution': gpa_distribution,
        })
