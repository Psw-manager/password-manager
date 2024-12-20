from django.db import models
import pyotp
from django.contrib.auth.hashers import check_password
from django.contrib.auth import get_user_model
from django.contrib.auth.models import User
#from django.contrib.auth.models import Password
import uuid

class User(models.Model):
    username = models.CharField(max_length=255, unique=True)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=255)
    creation_date = models.DateTimeField(auto_now_add=True)
    totp_secret = models.CharField(max_length=32, blank=True, null=True)
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    def __str__(self):
        return self.username

    def save(self, *args, **kwargs):
        if not self.totp_secret:
            self.totp_secret = pyotp.random_base32()  #generowanie klucza TOTP
        super().save(*args, **kwargs)

    def verify_password(self, raw_password):
        #Weryfikacja hasła
        return check_password(raw_password, self.password)

class Password(models.Model):

    SOCIAL_MEDIA = 'social_media'
    ECOMMERCE = 'ecommerce'
    WORK_PROFESSIONAL = 'work_professional'
    OTHER = 'other'

    CATEGORY_CHOICES = [
        (SOCIAL_MEDIA, 'Social Media'),
        (ECOMMERCE, 'E-commerce'),
        (WORK_PROFESSIONAL, 'Work/Professional'),
        (OTHER, 'Other'),
    ]
    user = models.ForeignKey(get_user_model(), on_delete=models.CASCADE, related_name='passwords', db_constraint=False)
    website_name = models.CharField(max_length=255)
    website_url = models.URLField(blank=True, null=True)
    password = models.TextField()
    creation_date = models.DateTimeField(auto_now_add=True)
    modification_date = models.DateTimeField(auto_now=True)
    category = models.CharField(
        max_length=50,
        choices=CATEGORY_CHOICES,
        default=OTHER,
    )