"""
Django Settings for Student Management System Backend.

This file configures:
- Database connection (existing students.db SQLite file)
- Installed apps (Django REST Framework, CORS headers, students app)
- Middleware (CORS middleware must come first)
- REST Framework pagination and filtering settings
"""

from pathlib import Path

# BASE_DIR points to: Asign/backend/
BASE_DIR = Path(__file__).resolve().parent.parent

# SECRET KEY - change this in production!
SECRET_KEY = 'django-insecure-student-mgmt-secret-key-change-in-prod'

# Debug mode - set False in production
DEBUG = True

# Hosts allowed to connect to this backend
ALLOWED_HOSTS = ['localhost', '127.0.0.1']

# ─── Installed Applications ──────────────────────────────────────────────────
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    # Third-party packages
    'rest_framework',          # Django REST Framework
    'corsheaders',             # Allow React frontend to call this API
    'django_filters',          # Filter support

    # Our custom app
    'students',
]

# ─── Middleware ───────────────────────────────────────────────────────────────
# IMPORTANT: CorsMiddleware must be placed as high as possible,
# before any middleware that can generate responses (like CommonMiddleware)
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',   # Must be first!
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'backend.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'backend.wsgi.application'

# ─── Database Configuration ───────────────────────────────────────────────────
# We connect to the EXISTING students.db file located one level up (Asign/).
# BASE_DIR.parent = Asign/ directory where students.db lives.
# Django will NOT modify the existing table structure because
# we use managed = False in the Student model.
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR.parent / 'students.db',  # Points to Asign/students.db
    }
}

# ─── Password Validation ──────────────────────────────────────────────────────
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validators.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validators.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validators.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validators.NumericPasswordValidator'},
]

# ─── Localization ─────────────────────────────────────────────────────────────
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

# ─── Static Files ─────────────────────────────────────────────────────────────
STATIC_URL = 'static/'

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# ─── CORS Configuration ───────────────────────────────────────────────────────
# Allow the React frontend (running on port 5173) to make API calls.
# In production, replace with your actual frontend domain.
CORS_ALLOWED_ORIGINS = [
    'http://localhost:5173',   # Vite dev server
    'http://127.0.0.1:5173',
    'http://localhost:3000',   # Alternative React port
]

CORS_ALLOW_ALL_ORIGINS = False  # Strict CORS in production

CORS_ALLOW_METHODS = [
    'GET', 'OPTIONS',  # Read-only API — POST/PUT/DELETE not needed
]

CORS_ALLOW_HEADERS = [
    'accept', 'accept-encoding', 'authorization',
    'content-type', 'dnt', 'origin',
    'user-agent', 'x-csrftoken', 'x-requested-with',
]

# ─── Django REST Framework Configuration ─────────────────────────────────────
REST_FRAMEWORK = {
    # Default pagination: 10 students per page
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 10,

    # Enable filtering support
    'DEFAULT_FILTER_BACKENDS': [
        'django_filters.rest_framework.DjangoFilterBackend',
        'rest_framework.filters.SearchFilter',
        'rest_framework.filters.OrderingFilter',
    ],

    # Return JSON by default; BrowsableAPIRenderer only in DEBUG mode
    'DEFAULT_RENDERER_CLASSES': [
        'rest_framework.renderers.JSONRenderer',
        *(['rest_framework.renderers.BrowsableAPIRenderer'] if DEBUG else []),
    ],
}
