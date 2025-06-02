from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SchoolViewSet, LevelViewSet, SchoolClassViewSet

router = DefaultRouter()
# These register /api/schools/, /api/levels/, /api/classes/
# Nested @actions provide /api/schools/<pk>/levels/ and /api/levels/<pk>/classes/
router.register(r'schools', SchoolViewSet, basename='school')
router.register(r'levels', LevelViewSet, basename='level') 
router.register(r'classes', SchoolClassViewSet, basename='schoolclass') 

urlpatterns = [
    path('', include(router.urls)),
]
