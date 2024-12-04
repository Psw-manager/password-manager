from django.urls import path
from . import views
from .views import (
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
    path('api/register/', RegisterView.as_view(), name='register'),
    path('api/login/', LoginView.as_view(), name='login'),
    path('api/password/add/', AddPasswordView.as_view(), name='add-password'),
    path('api/passwords/', ListPasswordsView.as_view(), name='list-passwords'),
    path('api/validate-totp/', ValidateTOTPView.as_view(), name='validate-totp'),
]