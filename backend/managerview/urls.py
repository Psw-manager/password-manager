from django.urls import path
from . import views
from .views import (
    CustomTokenRefreshView,
    GetAllUsersView,
    schema_view, 
    RegisterView, 
    LoginView, 
    AddPasswordView, 
    ListPasswordsView,
    ValidateTOTPView,
)

urlpatterns = [
    path('', views.index, name="index"),
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('password/add/', AddPasswordView.as_view(), name='add-password'),
    path('passwords/', ListPasswordsView.as_view(), name='list-passwords'),
    path('validate-totp/', ValidateTOTPView.as_view(), name='validate-totp'),
     path('users/', GetAllUsersView.as_view(), name='get_all_users'), 
     path('token/refresh/', CustomTokenRefreshView.as_view(), name='token_refresh'),
     
]