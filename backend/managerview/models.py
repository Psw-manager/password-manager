from django.db import models
import pyotp
from django.contrib.auth.hashers import check_password

class User(models.Model):
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    totp_secret = models.CharField(max_length=32, blank=True, null=True)


    def save(self, *args, **kwargs):
        if not self.totp_secret:
            self.totp_secret = pyotp.random_base32()  #generowanie klucza TOTP
        super().save(*args, **kwargs)

    def verify_password(self, raw_password):
        #Weryfikacja hasła
        return check_password(raw_password, self.password)
    
class Category(models.TextChoices):
        SOCIAL_MEDIA = 'Social Media', 'Social Media'
        EMAIL = 'Email', 'Email'
        BANKING = 'Banking', 'Banking'
        OTHER = 'Other', 'Other' 

class Password(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='passwords')
    site_name = models.CharField(max_length=255)
    site_url = models.CharField(max_length=255)
    username = models.TextField(null=False, blank=False)
    password = models.TextField(null=False, blank=False)
    creation_date = models.TextField( null=True, blank=True)
    modification_date = models.TextField(null=True, blank=True)
    notes = models.TextField(blank=True, null=True)
    category = models.CharField(
        max_length=20,
        choices=Category.choices,
        default=Category.OTHER,
    )
    

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['user', 'site_url', 'username'], name='unique_user_site_username')
        ]

    def __str__(self):
        return f"Password for {self.user.email}"

    