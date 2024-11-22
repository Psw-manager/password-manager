from django.test import TestCase
from rest_framework.test import APIClient
from backend.models import User
import pyotp

class ValidateTOTPTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create(
            username="testuser",
            email="testuser@example.com",
            hashed_password="hashed_password_example"
        )
        self.totp = pyotp.TOTP(self.user.totp_secret)

    def test_valid_totp_code(self):
        valid_code = self.totp.now()  #generowanie aktualnego kodu
        response = self.client.post('/api/validate-totp/', {
            'email': self.user.email,
            'code': valid_code
        })
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['message'], "TOTP code is valid")

    def test_invalid_totp_code(self):
        response = self.client.post('/api/validate-totp/', {
            'email': self.user.email,
            'code': '000000'
        })
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data['error'], "Invalid TOTP code")
