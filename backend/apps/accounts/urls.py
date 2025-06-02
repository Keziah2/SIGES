#backend/apps/accounts/urls.py
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, RoleViewSet
from django.urls import path, include

router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')
router.register(r'roles', RoleViewSet, basename='role')

urlpatterns = [
    path('', include(router.urls)),
]
