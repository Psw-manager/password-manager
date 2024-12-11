from rest_framework import serializers
from .models import User, Password
from django.contrib.auth.hashers import make_password
from cryptography.fernet import Fernet
from django.conf import settings

#klucz do szyfrowania (AES-256)
SECRET_KEY = Fernet.generate_key()
cipher_suite = Fernet(SECRET_KEY)

#login
class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

class LoginResponseSerializer(serializers.Serializer): 
    email = serializers.EmailField() 
    access_token = serializers.CharField() 
    refresh_token = serializers.CharField()

class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['email', 'password']

    def create(self, validated_data):
        validated_data['password'] = make_password(validated_data.pop('password')) #zahashowane haslo
        return super().create(validated_data)

class PasswordSerializer(serializers.ModelSerializer):
    # Make sure all relevant fields are serialized
    class Meta:
        model = Password
        fields = ['id', 'site_name', 'site_url', 'encrypted_password', 'created_at', 'updated_at']

    def create(self, validated_data):
        password = validated_data.pop('password')
        encrypted_password = cipher_suite.encrypt(password.encode())
        validated_data['encrypted_password'] = encrypted_password
        return super().create(validated_data)

    def to_representation(self, instance):
        # Decrypt the password before returning it in the response
        representation = super().to_representation(instance)
        decrypted_password = cipher_suite.decrypt(instance.encrypted_password.encode()).decode()
        representation['password'] = decrypted_password  # Add the decrypted password to the response
        return representation

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'password']