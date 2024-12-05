from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import smtplib
import pyotp
import base64
import logging
from django.db import models
from datetime import datetime
from django.conf import settings
from django.http import JsonResponse
from django.utils import timezone
from django.utils.translation import gettext_lazy as _
from django.core.mail import send_mail
from sms import send_sms
from twilio.rest import Client
from django.contrib.auth.models import (
    AbstractBaseUser, BaseUserManager, PermissionsMixin
)
logger = logging.getLogger(__name__)


class generateKey:
    @staticmethod
    def returnValue():
        return str(datetime.date(datetime.now())) + "Key"


def _generate_code():
    keygen = generateKey()
    key = base64.b32encode(keygen.returnValue().encode())
    otp = pyotp.TOTP(key)
    return otp.now()

class UserManager(BaseUserManager):
    def _create_user(
            self, username, password,
            is_staff, is_admin, is_superuser, is_bot, is_verified, **extra_fields):

        now = timezone.now()
        if not username:
            raise ValueError('Users must have username')
        user = self.model(
            username=username,
            is_staff=is_staff, is_admin=is_admin, is_superuser=is_superuser, is_bot=is_bot, 
            is_verified=is_verified, last_login=now, date_joined=now, **extra_fields
        )
        user.set_password(password)
        user.save()

        return user

    def create_user(self, username, password=None, **extra_fields):
        return self._create_user(
            username, password, False, False, False, False, False, **extra_fields)

    def create_superuser(self, username, password, **extra_fields):
        return self._create_user(
            username, password, True, True, True, False, True, **extra_fields
        )


class User(AbstractBaseUser, PermissionsMixin):
    username = models.CharField(max_length=50, unique=True)
    first_name = models.CharField(max_length=50, null=True, blank=True)
    last_name = models.CharField(max_length=50, null=True, blank=True)
    avatar = models.ImageField(null=True, blank=True)
    mobile = models.CharField(max_length=15, null=True,
                              blank=True, unique=True, default=None)
    email = models.EmailField(
        max_length=50, null=True, blank=True, unique=True, default=None)
    gender = models.CharField(max_length=5, null=True, blank=True)
    bio = models.TextField(max_length=100, null=True, blank=True)
    address = models.TextField(null=True, blank=True)
    birth_date = models.DateField(blank=True, null=True)
    preferences = models.JSONField(null=True, blank=True)
    is_bot = models.BooleanField(default=False)
    is_verified = models.BooleanField(default=False)
    is_used = models.BooleanField(default=False)
    is_admin = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=False)
    date_joined = models.DateTimeField(auto_now_add=True)
    is_modified = models.BooleanField(default=False)
    modified_at = models.DateTimeField(auto_now_add=True)
    is_deleted = models.BooleanField(default=False)
    deleted_at = models.DateTimeField(auto_now_add=True)
    restored_at = models.DateTimeField(null=True, blank=True)

    USERNAME_FIELD = 'username'
    EMAIL_FIELD = 'email'
    REQUIRED_FIELDS = []

    objects = UserManager()

    class Meta:
        db_table = 'User'
        managed = True
        ordering=('date_joined',)

    def get_full_name(self):
        full_name = '%s %s' % (self.first_name, self.last_name)
        return full_name.strip()

    def get_short_name(self):
        return self.first_name

    def email_user(self, subject, message, from_email=None, **kwargs):
        send_mail(subject, message, from_email, [self.email], **kwargs)

    def sms_user(self, subject, message, from_number, **kwargs):
        send_sms(subject, message, from_number, [self.mobile], **kwargs)

    def __str__(self):
        return self.username 


class OTPCodeManager(models.Manager):
    def create_otp_code(self, user, ipaddr):
        code = _generate_code()
        # code = '654321'
        otp_code = self.create(user=user, code=code, ipaddr=ipaddr)

        return otp_code

    def set_is_verified(self, code):
        try:
            otp_code = OTPCode.objects.get(code=code)
            otp_code.user.is_verified = True
            otp_code.user.is_active = True
            otp_code.user.save()
            return True
        except OTPCode.DoesNotExist:
            pass
        return False


class AbstractBaseCode(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL,
                             on_delete=models.CASCADE)
    code = models.CharField(max_length=50, primary_key=True)
    created_at = models.DateTimeField(default=timezone.now)

    class Meta:
        managed = True

    def send_email(self):
        subject = 'OTP Code'
        message = 'Your code is ' + self.code
        send_mail(subject, message, '', [self.user.email])

    def send_sms(self):
        message = 'Your code is ' + self.code
        send_sms(message, '', [self.user.mobile])

    def send_whatsapp(self):
        client = Client(settings.TWILIO_ACCOUNT_SID,
                        settings.TWILIO_AUTH_TOKEN)
        message = client.messages.create(
            from_='whatsapp:+14155238886',
            to='whatsapp:+{}'.format('2348035696802'),
            body='Your code is ' + self.code
        )
        print(message)

    def __str__(self):
        return self.code


class OTPCode(AbstractBaseCode):
    ipaddr = models.GenericIPAddressField()
    counter = models.IntegerField(default=0, blank=False)

    objects = OTPCodeManager()

    def send_otp_email(self):
        self.send_email()

    def send_otp_sms(self):
        self.send_sms()

    def send_otp_whatsapp(self):
        self.send_whatsapp()
