from django.http import HttpResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from .serializers import RegisterSerializer, PasswordSerializer  # Importowanie serializerów
from .models import User, Password
from django.contrib.auth import authenticate

# Strona główna
def index(request):
    return HttpResponse("Hello, world. This is the example index view.")

# Konfiguracja Swagger i Redoc
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

# Widok testowy
class HelloWorldView(APIView):
    def get(self, request):
        return Response({"message": "Hello, world!"})

# Widok rejestracji użytkownika
class RegisterView(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "User registered successfully!"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Widok logowania użytkownika
class LoginView(APIView):
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        user = authenticate(email=email, password=password)
        
        if user:
            return Response({"message": "Login successful!"}, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)

# Widok dodawania nowego hasła
class AddPasswordView(APIView):
    def post(self, request):
        serializer = PasswordSerializer(data=request.data)
        serializer.context['user'] = request.user  # Dodanie kontekstu użytkownika
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response({"message": "Password saved successfully!"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Widok odczytania zapisanych haseł
class ListPasswordsView(APIView):
    def get(self, request):
        passwords = Password.objects.filter(user=request.user)
        serializer = PasswordSerializer(passwords, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
