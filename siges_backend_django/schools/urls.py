from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SchoolViewSet, LevelViewSet, SchoolClassViewSet
from students.views import StudentViewSet

router = DefaultRouter()
router.register(r'schools', SchoolViewSet, basename='school')
router.register(r'levels', LevelViewSet, basename='level')
router.register(r'classes', SchoolClassViewSet, basename='schoolclass')
router.register(r'students', StudentViewSet, basename='student')

urlpatterns = [
    path('', include(router.urls)),
]
