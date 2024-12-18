from django.http import HttpResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from .serializers import (
    LoginResponseSerializer,
    RegisterSerializer,
    PasswordSerializer,
    UserSerializer,
)  # importowanie serializerów
from .models import User, Password
from django.contrib.auth import authenticate
import pyotp
from django.contrib.auth.hashers import check_password  # wbudowana funkcja
from django.http import HttpResponse
from django.http import JsonResponse
from django.views import View
from .serializers import LoginSerializer
from drf_yasg.utils import swagger_auto_schema
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.views import TokenRefreshView
import jwt
from jwt.exceptions import ExpiredSignatureError, DecodeError

class CustomTokenRefreshView(TokenRefreshView):
    permissions_classes = [AllowAny]
    pass


def index(request):
    return HttpResponse("Welcome to the Password Manager!")


# konfiguracja Swagger i Redoc
schema_view = get_schema_view(
    openapi.Info(
        title="My API",
        default_version="v1",
        description="API documentation for my project",
        terms_of_service="https://www.google.com/policies/terms/",
        contact=openapi.Contact(email="contact@example.com"),
        license=openapi.License(name="BSD License"),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

# widok rejestracji użytkownika
from drf_yasg.utils import swagger_auto_schema


class RegisterView(APIView):
    permission_classes = [AllowAny]

    @swagger_auto_schema(
        request_body=RegisterSerializer,
        responses={201: "User registered successfully", 400: "Validation error"},
    )
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "User registered successfully!"},
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# widok logowania użytkownika
class LoginView(APIView):
    permissions_classes = [AllowAny]
    @swagger_auto_schema(
        request_body=LoginSerializer,
        responses={200: LoginResponseSerializer, 401: "Invalid credentials"},
    )
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data["email"]
        password = serializer.validated_data["password"]
        print(f"Email: {email}, Password: {password}")

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response(
                {"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED
            )

        if check_password(password, user.password):
            refresh = RefreshToken.for_user(user)
            print(f"User email: {user.email}") 
            return Response(
                {
                    "email": str(user.email),
                    "access_token": str(refresh.access_token),
                    "refresh_token": str(refresh),
                }
            )
        else:
            return Response(
                {"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED
            )




# widok dodawania nowego hasła
class AddPasswordView(APIView):
    def post(self, request):
        serializer = PasswordSerializer(data=request.data)
        serializer.context["user"] = request.user
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(
                {"message": "Password saved successfully!"},
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# widok odczytania zapisanych haseł

class ListPasswordsView(APIView):

    def get(self, request):
        # Retrieve email from query parameters
        email_from_query = request.query_params.get('email')

        # Check if the email is provided in the query parameters
        if not email_from_query:
            return Response({"error": "Email is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Find the user with the given email
            user = User.objects.get(email=email_from_query)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        # Get the passwords associated with the found user
        passwords = Password.objects.filter(user=user)
        serializer = PasswordSerializer(passwords, many=True)

        # Return the passwords as a JSON response
        return Response(serializer.data, status=status.HTTP_200_OK)



class ValidateTOTPView(APIView):
    def post(self, request):
        email = request.data.get("email")
        submitted_code = request.data.get("code")

        if not email or not submitted_code:
            return Response(
                {"error": "Email and code are required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response(
                {"error": "User not found"}, status=status.HTTP_404_NOT_FOUND
            )

        totp = pyotp.TOTP(user.totp_secret)
        is_valid = totp.verify(submitted_code)

        if is_valid:
            return Response(
                {"message": "TOTP code is valid"}, status=status.HTTP_200_OK
            )
        else:
            return Response(
                {"error": "Invalid TOTP code"}, status=status.HTTP_400_BAD_REQUEST
            )


class GetAllUsersView(APIView):
    permission_classes = [AllowAny]

    @swagger_auto_schema(responses={200: UserSerializer(many=True)})
    def get(self, request):
        # Query all users
        users = User.objects.all()
        # Serialize the user data
        serializer = UserSerializer(users, many=True)
        # Return a response with the serialized data
        return Response(serializer.data, status=status.HTTP_200_OK)
