# Development settings
from .base import *

"""
Development Settings
"""

import environ
from pathlib import Path

env = environ.Env(
    # set casting, default value
    DEBUG=(bool, False)
)

environ.Env.read_env(os.path.join(BASE_DIR, '.env.prod'))

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/4.0/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = env('SECRET_KEY')

# SECURITY WARNING: don't run with debug turned on in production!
# DEBUG = True
DEBUG = env('DEBUG')

CORS_ORIGIN_ALLOW_ALL = False
CORS_ALLOW_CREDENTIALS = True
# ALLOWED_HOSTS = ['*']

# ALLOWED_HOSTS = [
#     'localhost:3000'
# ]

# CORS_ALLOW_HEADERS = [
#     'accept',
#     'accept-encoding',
#     'authorization',
#     'content-type',
#     'dnt',
#     'origin',
#     'user-agent',
#     'x-csrftoken',
#     'x-requested-with',
# ]

# CORS_ORIGIN_WHITELIST = [
#     'http://localhost:3000'
# ]

ALLOWED_HOSTS = env("ALLOWED_HOSTS").split(' ')
CORS_ORIGIN_WHITELIST = env('CORS_ORIGIN_WHITELIST').split(' ')

# Database
# https://docs.djangoproject.com/en/4.0/ref/settings/#databases

# DATABASES = {
#     'default': {
#         'ENGINE': 'django.db.backends.sqlite3',
#         'NAME': BASE_DIR / 'db.sqlite3',
#     }
# }

DATABASES = {
    'default': env.db(),

    'extra': env.db_url(
        'SQLITE_URL',
        default='sqlite:////db.sqlite3'
    )
}

# DATABASES = {
#     'default': {
#         "ENGINE": env("DB_ENGINE"),
#         "NAME": env("DB_DATABASE"),
#         "USER": env("DB_USER"),
#         "PASSWORD": env("DB_PASSWORD"),
#         "HOST": env("DB_HOST"),
#         "PORT": env("DB_PORT"),
#     },

#     'extra': env.db_url(
#         'SQLITE_URL',
#         default='sqlite:////db.sqlite3'
#     )
# }

EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'

TWILIO_ACCOUNT_SID=env('TWILIO_ACCOUNT_SID')

TWILIO_AUTH_TOKEN=env('TWILIO_AUTH_TOKEN')

SMS_BACKEND = 'sms.backends.console.SmsBackend'

# SMS_BACKEND = 'sms.backends.nexmo.SmsBackend'
# NEXMO_API_KEY = '878c0ff6'
NEXMO_SECRET_KEY = env('NEXMO_SECRET_KEY')

# SMS_BACKEND = 'sms.backends.messagebird.SmsBackend'
# MESSAGEBIRD_ACCESS_KEY = 'live_redacted-messagebird-access-key'
# AWS_SMTP_SERVER=env('AWS_SMTP_SERVER')
# AWS_SMTP_USERNAME=env('AWS_SMTP_USERNAME')
# AWS_SMTP_PASSWORD=env('AWS_SMTP_PASSWORD')