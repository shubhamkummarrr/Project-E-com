"""
Django settings for backend project.
Updated to support LOCALHOST development + Production.
"""

from pathlib import Path
from datetime import timedelta
import os

BASE_DIR = Path(__file__).resolve().parent.parent

# ============================
# DEBUG & HOST CONFIG
# ============================
ENV = os.getenv("ENV", "local")   # local / production

if ENV == "production":
    DEBUG = False
    ALLOWED_HOSTS = ["16.170.39.24"]
else:
    DEBUG = True
    ALLOWED_HOSTS = ["localhost", "127.0.0.1", "0.0.0.0"]


SECRET_KEY = os.getenv(
    "SECRET_KEY",
    "local-dev-secret-key"   # Safe fallback for localhost
)


# ============================
# APPLICATIONS
# ============================
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'ecom',
    'rest_framework',
    'corsheaders',
]


# ============================
# MIDDLEWARE
# ============================
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]


ROOT_URLCONF = 'backend.urls'


# ============================
# TEMPLATES
# ============================
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'backend.wsgi.application'


# ============================
# DATABASE (LOCAL + PRODUCTION)
# ============================
if ENV == "production":
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.postgresql',
            'NAME': os.getenv('DB_NAME'),
            'USER': os.getenv('DB_USER'),
            'PASSWORD': os.getenv('DB_PASSWORD'),
            'HOST': os.getenv('DB_HOST'),
            'PORT': os.getenv('DB_PORT'),
        }
    }
else:
    # LOCAL — no need to configure PostgreSQL
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': BASE_DIR / 'db.sqlite3',
        }
    }


# ============================
# PASSWORD VALIDATION
# ============================
AUTH_PASSWORD_VALIDATORS = [
    {"NAME": 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {"NAME": 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {"NAME": 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {"NAME": 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]


# ============================
# INTERNATIONALIZATION
# ============================
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True


# ============================
# STATIC & MEDIA
# ============================
STATIC_URL = 'static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')

MEDIA_URL = "/media/"
MEDIA_ROOT = os.path.join(BASE_DIR, "media")


DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
AUTH_USER_MODEL = 'ecom.User'


# ============================
# EMAIL CONFIG
# ============================
if ENV == "production":
    EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"
    EMAIL_HOST = 'smtp.gmail.com'
    EMAIL_PORT = 587
    EMAIL_HOST_USER = os.environ.get('EMAIL_USER')
    EMAIL_HOST_PASSWORD = os.environ.get('EMAIL_PASS')
    EMAIL_USE_TLS = True
else:
    # LOCAL EMAIL LOGS IN TERMINAL
    EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"



# ============================
# REST FRAMEWORK & JWT
# ============================
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.AllowAny',
    ]
}

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=5),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=1),
    "AUTH_HEADER_TYPES": ("Bearer",),
    "AUTH_HEADER_NAME": "HTTP_AUTHORIZATION",
    "USER_ID_FIELD": "id",
    "USER_ID_CLAIM": "user_id",
    "AUTH_TOKEN_CLASSES": ("rest_framework_simplejwt.tokens.AccessToken",),
}

PASSWORD_RESET_TIMEOUT = 900
