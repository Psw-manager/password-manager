from django.urls import path
from . import views
from .views import HelloWorldView, schema_view 

urlpatterns = [
    path('', views.index, name="index"),
    path('api/hello/', HelloWorldView.as_view(), name='hello-world'),
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
]