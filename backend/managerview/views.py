from datetime import datetime, timedelta
from django.http import HttpResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from .serializers import (
    LoginResponseSerializer,
    PasswordDetailsSerializer,
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




class UpdatePasswordView(APIView):
    @swagger_auto_schema(
        request_body=PasswordDetailsSerializer,
        responses={200: "Password updated successfully!", 400: "Validation error", 404: "Password not found"},
        manual_parameters=[
            openapi.Parameter(
                "email",  # Name of the parameter
                openapi.IN_QUERY,  # Specify it's a query parameter
                description="Email of the user",
                type=openapi.TYPE_STRING,
                required=True,  # Set to True if the parameter is mandatory
            ),
            openapi.Parameter(
                "password_id",  # Name of the parameter to identify the password to be updated
                openapi.IN_PATH,  # Specify it's a path parameter
                description="ID of the password to be updated",
                type=openapi.TYPE_STRING,  # Assuming ID is a string
                required=True,
            ),
        ],
    )
    def put(self, request, password_id):
        # Retrieve email from query parameters
        email = request.query_params.get("email")
        if not email:
            return Response(
                {"error": "Email is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Attempt to get the user based on the email
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response(
                {"error": "User with the provided email does not exist."},
                status=status.HTTP_404_NOT_FOUND,
            )

        # Attempt to retrieve the password object by its ID
        try:
            password = Password.objects.get(id=password_id, user=user)
        except Password.DoesNotExist:
            return Response(
                {"error": "Password not found for this user."},
                status=status.HTTP_404_NOT_FOUND,
            )

        # Deserialize the incoming data and update the password
        serializer = PasswordDetailsSerializer(password, data=request.data, partial=True)
        serializer.context["user"] = user  # Include user context if needed for validation

        if serializer.is_valid():
            # Add timestamps (or any other fields you may want to update)
            # You can also rely on model fields like auto_now or auto_now_add if appropriate
            updated_at = (datetime.now() + timedelta(hours=1)).strftime("%Y-%m-%d %H:%M:%S")
            serializer.validated_data['modification_date'] = updated_at
            # Save the updated password record
            serializer.save()

            return Response(
                {"message": "Password updated successfully!"},
                status=status.HTTP_200_OK,
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
# View for adding a new password
class AddPasswordView(APIView):
    @swagger_auto_schema(
        request_body=PasswordDetailsSerializer,
        responses={201: "Password saved successfully!", 400: "Validation error"},
        manual_parameters=[
            openapi.Parameter(
                "email",  # Name of the parameter
                openapi.IN_QUERY,  # Specify it's a query parameter
                description="Email of the user",
                type=openapi.TYPE_STRING,
                required=True,  # Set to True if the parameter is mandatory
            ),
        ],
        
    )
    def post(self, request):
        email = request.query_params.get("email") 
        try:
            user = User.objects.get(email=email)  
        except User.DoesNotExist:
            return Response(
                {"error": "User with the provided email does not exist."},
                status=status.HTTP_404_NOT_FOUND,
            )
        
        serializer = PasswordDetailsSerializer(data=request.data)
        serializer.context["user"] = user  
        
        if serializer.is_valid():
            serializer.validated_data['creation_date'] = (datetime.now() + timedelta(hours=1)).strftime("%Y-%m-%d %H:%M:%S")
            serializer.validated_data['modification_date'] = (datetime.now() + timedelta(hours=1)).strftime("%Y-%m-%d %H:%M:%S")
            serializer.save(user=user)
            return Response(
                {"message": "Password saved successfully!"},
                status=status.HTTP_201_CREATED,
            )
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# widok odczytania zapisanych haseł

class ListPasswordsView(APIView):
    @swagger_auto_schema(
        responses={200: PasswordSerializer(many=True)},
        manual_parameters=[
            openapi.Parameter(
                "email",  # Name of the parameter
                openapi.IN_QUERY,  # Specify it's a query parameter
                description="Email of the user",
                type=openapi.TYPE_STRING,
                required=True,  # Set to True if the parameter is mandatory
            ),
        ],
    )
    def get(self, request):
        email_from_query = request.query_params.get('email')

 
        if not email_from_query:
            return Response({"error": "Email is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:

            user = User.objects.get(email=email_from_query)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        passwords = Password.objects.filter(user=user)
        serializer = PasswordSerializer(passwords, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class ListPasswordsDetailsView(APIView):
    @swagger_auto_schema(
        responses={200: PasswordDetailsSerializer(many=True)},
        manual_parameters=[
            openapi.Parameter(
                "email",  # Name of the parameter
                openapi.IN_QUERY,  # Specify it's a query parameter
                description="Email of the user",
                type=openapi.TYPE_STRING,
                required=True,  # Set to True if the parameter is mandatory
            ),
        ],
    )
    def get(self, request):
        email_from_query = request.query_params.get('email')

 
        if not email_from_query:
            return Response({"error": "Email is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:

            user = User.objects.get(email=email_from_query)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        passwords = Password.objects.filter(user=user)
        serializer = PasswordDetailsSerializer(passwords, many=True)
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


class ListPasswordDetailView(APIView):
    @swagger_auto_schema(
        responses={200: PasswordDetailsSerializer},
        manual_parameters=[
            openapi.Parameter(
                "email",  # Name of the parameter
                openapi.IN_QUERY,  # Specify it's a query parameter
                description="Email of the user",
                type=openapi.TYPE_STRING,
                required=True,  # Set to True if the parameter is mandatory
            ),
            openapi.Parameter(
                "id",  # Name of the parameter
                openapi.IN_QUERY,  # Specify it's a query parameter
                description="ID of the password record",
                type=openapi.TYPE_STRING,
                required=True,  # Set to True if the parameter is mandatory
            ),
        ],
    )
    def get(self, request):
        email_from_query = request.query_params.get('email')
        password_id_from_query = request.query_params.get('id')

        # Check if both email and password ID are provided
        if not email_from_query or not password_id_from_query:
            return Response({"error": "Email and password ID are required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Get the user by email
            user = User.objects.get(email=email_from_query)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        try:
            # Get the password by user and password ID
            password = Password.objects.get(user=user, id=password_id_from_query)
        except Password.DoesNotExist:
            return Response({"error": "Password not found for this user"}, status=status.HTTP_404_NOT_FOUND)

        # Serialize and return the password data
        serializer = PasswordDetailsSerializer(password)
        return Response(serializer.data, status=status.HTTP_200_OK)
