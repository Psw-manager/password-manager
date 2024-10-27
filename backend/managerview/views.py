from django.http import HttpResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

def index(request):
    return HttpResponse("Hello, world. This is the example index view.")

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

class HelloWorldView(APIView):
    def get(self, request):
        return Response({"message": "Hello, world!"})