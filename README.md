# Student Management System — Full Stack

A complete full-stack student management system built with Django REST Framework + React + Vite + Tailwind CSS, connected to an existing SQLite database with 100 student records.

---

## Project Structure

```
Asign/
│
├── backend/                  ← Django + DRF
│   ├── backend/
│   │   ├── settings.py       ← DB config, CORS, REST_FRAMEWORK settings
│   │   ├── urls.py           ← Main URL router
│   │   ├── wsgi.py
│   │   └── asgi.py
│   ├── students/
│   │   ├── models.py         ← Student model (managed=False → uses existing table)
│   │   ├── serializers.py    ← Python ↔ JSON conversion
│   │   ├── views.py          ← API logic (search, filter, sort, stats)
│   │   ├── urls.py           ← API URL patterns
│   │   ├── admin.py          ← Admin panel config
│   │   └── apps.py
│   ├── venv/                 ← Python virtual environment
│   ├── manage.py
│   └── requirements.txt
│
├── frontend/                 ← React + Vite + Tailwind
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js      ← Axios instance with base URL + interceptors
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── StudentCard.jsx
│   │   │   ├── StudentTable.jsx
│   │   │   ├── SearchBar.jsx
│   │   │   ├── DepartmentFilter.jsx
│   │   │   ├── GPAFilter.jsx
│   │   │   ├── LoadingSpinner.jsx
│   │   │   └── EmptyState.jsx
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── StudentsList.jsx
│   │   │   └── StudentDetails.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
│
├── students.db               ← Existing SQLite database (100 records)
└── README.md
```

---

## Tech Stack

| Layer    | Technology                          |
|----------|-------------------------------------|
| Frontend | React 18, Vite 5, Tailwind CSS 3    |
| Routing  | React Router DOM v6                 |
| HTTP     | Axios                               |
| Backend  | Django 6, Django REST Framework     |
| CORS     | django-cors-headers                 |
| Database | SQLite (`students.db`)              |

---

## Step 1 — Set Up & Run Backend

```bash
# 1. Navigate to backend directory
cd backend

# 2. Activate the virtual environment
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# 3. (Already done) Install dependencies:
pip install -r requirements.txt

# 4. (Already done) Apply migrations — creates admin/auth/session tables
#    The students table is NOT touched (managed=False in models.py)
python manage.py migrate

# 5. (Optional) Create admin account to access /admin panel
python manage.py createsuperuser

# 6. Start the Django server
python manage.py runserver
```

Backend will be live at: **http://127.0.0.1:8000**

---

## Step 2 — Set Up & Run Frontend

Open a **new terminal window** and run:

```bash
# 1. Navigate to frontend directory
cd frontend

# 2. (Already done) Install npm packages
npm install

# 3. Start the Vite dev server
npm run dev
```

Frontend will be live at: **http://localhost:5173**

---

## API Endpoints

| Method | URL | Description |
|--------|-----|-------------|
| GET | `/api/students/` | List all students (paginated) |
| GET | `/api/students/<id>/` | Single student detail |
| GET | `/api/students/departments/` | List of all departments |
| GET | `/api/students/stats/` | Dashboard statistics |

### Query Parameters for `/api/students/`

| Parameter | Example | Description |
|-----------|---------|-------------|
| `search` | `?search=Aarav` | Filter by name or student ID |
| `department` | `?department=CSE` | Filter by department |
| `gender` | `?gender=Female` | Filter by gender |
| `semester` | `?semester=4` | Filter by semester |
| `ordering` | `?ordering=-gpa` | Sort field (prefix `-` for descending) |
| `page` | `?page=2` | Page number |
| `page_size` | `?page_size=20` | Items per page (max 100) |

### Sample API Responses

**GET /api/students/?page_size=2**
```json
{
  "count": 100,
  "next": "http://127.0.0.1:8000/api/students/?page=2&page_size=2",
  "previous": null,
  "results": [
    {
      "student_id": "S001",
      "name": "Aarav Sharma",
      "age": 20,
      "gender": "Male",
      "department": "CSE",
      "semester": 4,
      "gpa": 8.2
    }
  ]
}
```

**GET /api/students/stats/**
```json
{
  "total_students": 100,
  "avg_gpa": 8.31,
  "department_count": 6,
  "gender_stats": { "Male": 50, "Female": 50 },
  "dept_stats": [
    { "department": "CSE", "count": 30, "avg_gpa": 8.87 }
  ],
  "gpa_distribution": {
    "7.5 - 8.0": 30,
    "8.0 - 8.5": 30,
    "8.5 - 9.0": 20,
    "9.0 - 9.5": 20
  }
}
```

---

## How the Data Flow Works

```
React Frontend
     │
     │  axios.get('/students/?search=Aarav&department=CSE')
     │
     ▼
Django (urls.py → students/urls.py)
     │
     │  Routes to StudentViewSet.list()
     │
     ▼
views.py → get_queryset()
     │
     │  Student.objects.filter(name__icontains='Aarav', department='CSE')
     │
     ▼
Django ORM → SQLite (students.db → students table)
     │
     │  Raw SQL: SELECT * FROM students WHERE name LIKE '%Aarav%'
     │
     ▼
StudentSerializer (Python objects → JSON)
     │
     ▼
JSON Response → React State → UI renders
```

---

## Frontend Pages

| Route | Page | Description |
|-------|------|-------------|
| `/` | Dashboard | Stats cards, dept breakdown, GPA chart, top 5 |
| `/students` | Students List | Table/card view, search, filter, paginate |
| `/students/:id` | Student Details | Full student profile with GPA ring |

---

## Key Design Decisions

### `managed = False` in models.py
The Student model uses `managed = False` which tells Django:
> "This table already exists in the database. Don't create, alter, or drop it."

This is how we connect to the pre-existing `students.db` file safely.

### Axios Base URL
All frontend API calls go through `src/api/axios.js` which sets `baseURL: 'http://127.0.0.1:8000/api'`. Change this one file to point to a production server.

### Vite Proxy
`vite.config.js` proxies `/api` calls to `http://127.0.0.1:8000`. This means in development, React can call `/api/students/` instead of the full URL.

---

## Common Errors & Fixes

| Error | Cause | Fix |
|-------|-------|-----|
| `CORS error` in browser | Django CORS not configured | Check `CORS_ALLOWED_ORIGINS` in `settings.py` |
| `No response from server` | Django not running | Run `python manage.py runserver` |
| `404 on /api/students/` | URL typo | Ensure trailing slash: `/api/students/` |
| `students table not found` | Wrong DB path | Check `BASE_DIR.parent / 'students.db'` in `settings.py` |
| `ModuleNotFoundError: django` | venv not activated | Run `venv\Scripts\activate` (Windows) |
| React shows blank page | Vite not running | Run `npm run dev` in frontend/ |

---

## Verify Database Records

```bash
# From the Asign/ root directory
python -c "
import sqlite3
conn = sqlite3.connect('students.db')
cur = conn.cursor()
cur.execute('SELECT COUNT(*) FROM students')
print('Total:', cur.fetchone()[0])
cur.execute('SELECT * FROM students LIMIT 3')
for row in cur.fetchall():
    print(row)
conn.close()
"
```

---

## Test APIs from Terminal

```bash
# All students (first page)
curl http://127.0.0.1:8000/api/students/

# Search by name
curl "http://127.0.0.1:8000/api/students/?search=Priya"

# Filter by department
curl "http://127.0.0.1:8000/api/students/?department=CSE"

# Sort by GPA descending
curl "http://127.0.0.1:8000/api/students/?ordering=-gpa"

# Combined: CSE students, sorted by GPA
curl "http://127.0.0.1:8000/api/students/?department=CSE&ordering=-gpa"

# Dashboard stats
curl http://127.0.0.1:8000/api/students/stats/

# Department list
curl http://127.0.0.1:8000/api/students/departments/

# Single student
curl http://127.0.0.1:8000/api/students/S001/
```
