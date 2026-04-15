from django.urls import path
from .views import register, login_user, get_metadata
from .views import get_users

urlpatterns = [
    path('register/', register),
    path('login/', login_user),
    path('metadata/', get_metadata),
    path('users/', get_users),
]