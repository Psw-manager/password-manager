from django.http import HttpResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from .serializers import RegisterSerializer, PasswordSerializer  # Importowanie serializerów
from .models import User, Password
from django.contrib.auth import authenticate
import pyotp

#konfiguracja Swagger i Redoc
schema_view = get_schema_view(
    openapi.Info(
        title="My API",
        default_version='v1',
        description="API documentation for my project",
        terms_of_service="https://www.google.com/policies/terms/",
        contact=openapi.Contact(email="contact@example.com"),
        license=openapi.License(name="BSD License"),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

#widok rejestracji użytkownika
class RegisterView(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "User registered successfully!"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#widok logowania użytkownika
class LoginView(APIView):
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        user = authenticate(email=email, password=password)
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

        if user.verify_password(password):
            return Response({'message': 'Login successful!'})
        else:
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

#widok dodawania nowego hasła
class AddPasswordView(APIView):
    def post(self, request):
        serializer = PasswordSerializer(data=request.data)
        serializer.context['user'] = request.user
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response({"message": "Password saved successfully!"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#widok odczytania zapisanych haseł
class ListPasswordsView(APIView):
    def get(self, request):
        passwords = Password.objects.filter(user=request.user)
        serializer = PasswordSerializer(passwords, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class ValidateTOTPView(APIView):
    def post(self, request):
        email = request.data.get('email')
        submitted_code = request.data.get('code')

        if not email or not submitted_code:
            return Response({"error": "Email and code are required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        totp = pyotp.TOTP(user.totp_secret)
        is_valid = totp.verify(submitted_code)

        if is_valid:
            return Response({"message": "TOTP code is valid"}, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Invalid TOTP code"}, status=status.HTTP_400_BAD_REQUEST)
