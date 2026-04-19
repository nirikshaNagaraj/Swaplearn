from django.urls import path
from .views import (
    users_list,
    login_user,
    register_user,
    update_profile,
    metadata,
    get_matches,
    complete_session,
)

urlpatterns = [
    path('users/', users_list),
    path('login/', login_user),
    path('register/', register_user),
    path('update_profile/', update_profile),
    path('metadata/', metadata),
    path('matches/', get_matches),
    path('complete_session/', complete_session),
]