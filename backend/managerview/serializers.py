from rest_framework import serializers
from .models import User, Password
from django.contrib.auth.hashers import make_password
from cryptography.fernet import Fernet
from django.conf import settings
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.backends import default_backend
import os
from base64 import urlsafe_b64encode, urlsafe_b64decode
import hashlib
import base64


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
        validated_data['password'] = make_password(validated_data.pop('password')) 
        return super().create(validated_data)
    
MY_SECRET_KEY = 'thisisaverysecuresecretkeythatyouwilluseinproduction'

def derive_fernet_key(secret_key: str) -> bytes:
    sha256_hash = hashlib.sha256(secret_key.encode()).digest()
    fernet_key = base64.urlsafe_b64encode(sha256_hash[:32]) 
    return fernet_key


FERNET_KEY = derive_fernet_key(MY_SECRET_KEY)

cipher_suite = Fernet(FERNET_KEY)

class PasswordSerializer(serializers.ModelSerializer):
    class Meta:
        model = Password
        fields = ['id', 'site_name', 'username', 'category']


    def create(self, validated_data):
        plaintext_password = validated_data.pop('password')
        encrypted_password = cipher_suite.encrypt(plaintext_password.encode()).decode()
        validated_data['password'] = encrypted_password 
        return super().create(validated_data)

    def update(self, instance, validated_data):
        if 'password' in validated_data:
            plaintext_password = validated_data.pop('password')
            encrypted_password = cipher_suite.encrypt(plaintext_password.encode()).decode()
            validated_data['password'] = encrypted_password  
        return super().update(instance, validated_data)

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        try:
            decrypted_password = cipher_suite.decrypt(instance.password.encode()).decode()
            representation['password'] = decrypted_password  
        except Exception:
            representation['password'] = "Decryption failed"  
        return representation
    


class PasswordDetailsSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)  

    class Meta:
        model = Password
        fields = ['id', 'site_name', 'username', 'category', 'site_url', 'password', 'creation_date', 'modification_date', 'notes']

    # Create method to encrypt the password before saving it
    def create(self, validated_data):
        plaintext_password = validated_data.pop('password')
        # Encrypt the plaintext password
        encrypted_password = cipher_suite.encrypt(plaintext_password.encode()).decode()
        validated_data['password'] = encrypted_password
        return super().create(validated_data)

    # Update method to encrypt the password before saving it
    def update(self, instance, validated_data):
        if 'password' in validated_data:
            plaintext_password = validated_data.pop('password')
            # Encrypt the plaintext password
            encrypted_password = cipher_suite.encrypt(plaintext_password.encode()).decode()
            validated_data['password'] = encrypted_password
        return super().update(instance, validated_data)

    # to_representation to decrypt the password when sending the response
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        try:
            # Decrypt the password
            decrypted_password = cipher_suite.decrypt(instance.password.encode()).decode()
            representation['password'] = decrypted_password
        except Exception:
            # Handle decryption failure (e.g., if the password is not encrypted)
            representation['password'] = "Decryption failed"
        return representation

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'password']