from django.http import HttpResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from .serializers import RegisterSerializer, PasswordSerializer, UserSerializer  #importowanie serializerów
from .models import User, Password
from django.contrib.auth import authenticate
import pyotp
from django.contrib.auth.hashers import check_password #wbudowana funkcja
from django.http import HttpResponse
from django.http import JsonResponse
from django.views import View
from .serializers import LoginSerializer
from drf_yasg.utils import swagger_auto_schema
from rest_framework.permissions import AllowAny
from rest_framework.permissions import IsAuthenticated

def index(request):
    return HttpResponse("Welcome to the Password Manager!")

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
from drf_yasg.utils import swagger_auto_schema

class RegisterView(APIView):
    permission_classes = [AllowAny]
    @swagger_auto_schema(
        request_body=RegisterSerializer,
        responses={
            201: "User registered successfully",
            400: "Validation error"
        }
    )
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "User registered successfully!"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#widok logowania użytkownika
class LoginView(APIView):
    @swagger_auto_schema(
        request_body=LoginSerializer,
        responses={
            200: "Login successful",
            401: "Invalid credentials"
        }
    )
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data['email']
        password = serializer.validated_data['password']

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

        if check_password(password, user.password):
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

class GetAllUsersView(APIView):
    permission_classes = [AllowAny]

    @swagger_auto_schema(
        responses={200: UserSerializer(many=True)}
    )

    def get(self, request):
        # Query all users
        users = User.objects.all()
        # Serialize the user data
        serializer = UserSerializer(users, many=True)
        # Return a response with the serialized data
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class GetPasswordsView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        passwords = Password.objects.filter(user=request.user) #filtrowanie obiektow modelu password ktore sa powiazane z zalogowanym uzytkownikiem
        serializer = PasswordSerializer(passwords, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class GetPasswordByIdView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request, password_id):
        try:
            password = Password.objects.get(id=password_id, user=request.user) #pobieranie hasla powiazane z id i uzytkownikiem
        except Password.DoesNotExist:
            return Response({"error": "Password not found"}, status=status.HTTP_404_NOT_FOUND)
        serializer = PasswordSerializer(password)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class DeletePasswordsView(APIView):
    permission_classes = [IsAuthenticated]
    def delete(self, request):
        password_ids = request.data.get("password_ids", []) #pobieranie listy id hasel do usuniecia z danych
        if not password_ids:
            return Response({"error": "No password IDs provided"}, status=status.HTTP_400_BAD_REQUEST)
        Password.objects.filter(id__in=password_ids, user=request.user).delete() #usuwanie wszystkich obiektow password ktore maja id 
        return Response({"message": "Passwords deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
    
class UpdatePasswordView(APIView):
    permission_classes = [IsAuthenticated]
    def put(self, request, password_id):
        try:
            password = Password.objects.get(id=password_id, user=request.user)
        except Password.DoesNotExist:
            return Response({"error": "Password not found"}, status=status.HTTP_404_NOT_FOUND)
        data = request.data #zmieniamy dane
        password.site_name = data.get("site_name", password.site_name) #zaktualizowanie danych hasla
        password.site_url = data.get("site_url", password.site_url)
        password.encrypted_password = cipher_suite.encrypt(data.get("password", "").encode()) #zaszyfrowanie nowego hasla jesli zostalo podane i zapisanie w "encrypted_password"
        password.save()
        serializer = PasswordSerializer(password)
        return Response(serializer.data, status=status.HTTP_200_OK)