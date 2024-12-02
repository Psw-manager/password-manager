from django.test import TestCase
from rest_framework.test import APIClient, APITestCase
from django.contrib.auth.hashers import make_password, check_password
from backend.models import User
import pyotp


class ValidateTOTPTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create(
            username="testuser",
            email="testuser@example.com",
            password=make_password("securepassword123")  # Poprawne hashowanie hasła
        )
        self.totp = pyotp.TOTP(self.user.totp_secret)  # TOTP dla użytkownika

    def test_valid_totp_code(self):
        valid_code = self.totp.now()  # Generuje aktualny kod TOTP
        response = self.client.post('/api/validate-totp/', {
            'email': self.user.email,
            'code': valid_code
        })
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['message'], "TOTP code is valid")

    def test_invalid_totp_code(self):
        response = self.client.post('/api/validate-totp/', {
            'email': self.user.email,
            'code': '000000'  # Fałszywy kod
        })
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data['error'], "Invalid TOTP code")


class UserAuthenticationTests(APITestCase):
    def test_register_user(self):
        response = self.client.post('/api/register/', {
            'username': 'testuser',
            'email': 'testuser@example.com',
            'password': 'securepassword123'
        })
        self.assertEqual(response.status_code, 201)  # Rejestracja zakończona sukcesem

        # Sprawdzanie, czy użytkownik został poprawnie utworzony
        user = User.objects.get(email='testuser@example.com')
        self.assertTrue(check_password('securepassword123', user.password))  # Hasło jest prawidłowo zahashowane

    def test_login_user(self):
        # Tworzenie użytkownika w bazie danych
        user = User.objects.create(
            username='testuser',
            email='testuser@example.com',
            password=make_password('securepassword123')
        )
        response = self.client.post('/api/login/', {
            'email': 'testuser@example.com',
            'password': 'securepassword123'
        })
        self.assertEqual(response.status_code, 200)  # Logowanie zakończone sukcesem
        self.assertEqual(response.data['message'], 'Login successful!')
