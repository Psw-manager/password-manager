from django.db import models
import pyotp
from django.contrib.auth.hashers import check_password

class User(models.Model):
    username = models.CharField(max_length=255, unique=True)
    email = models.EmailField(unique=True)
    hashed_password = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    totp_secret = models.CharField(max_length=32, blank=True, null=True)

    def __str__(self):
        return self.username

    def save(self, *args, **kwargs):
        if not self.totp_secret:
            self.totp_secret = pyotp.random_base32()  #generowanie klucza TOTP
        super().save(*args, **kwargs)

    def verify_password(self, raw_password):
        return check_password(raw_password, self.hashed_password)

class Password(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='passwords')
    site_name = models.CharField(max_length=255)
    site_url = models.URLField(blank=True, null=True)
    encrypted_password = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        indexes = [
            models.Index(fields=['user']),
        ]

    def __str__(self):
        return f"{self.site_name} for {self.user.username}"