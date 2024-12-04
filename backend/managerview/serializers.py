from rest_framework import serializers
from .models import User, Password
from django.contrib.auth.hashers import make_password
from cryptography.fernet import Fernet
from django.conf import settings

#klucz do szyfrowania (AES-256)
SECRET_KEY = Fernet.generate_key()
cipher_suite = Fernet(SECRET_KEY)

class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'password']

    def create(self, validated_data):
        validated_data['password'] = make_password(validated_data.pop('password')) #zahashowane haslo
        return super().create(validated_data)

class PasswordSerializer(serializers.ModelSerializer):
    class Meta:
        model = Password
        fields = ['site_name', 'site_url', 'password']

    def create(self, validated_data):
        password = validated_data.pop('password')
        encrypted_password = cipher_suite.encrypt(password.encode())
        validated_data['encrypted_password'] = encrypted_password
        return super().create(validated_data)

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        decrypted_password = cipher_suite.decrypt(instance.encrypted_password).decode()
        representation['password'] = decrypted_password
        return representation