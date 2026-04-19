from django.urls import path
from .views import (
    users_list,
    login_user,
    register_user,
    update_profile,
    metadata,
    get_matches,
    complete_session,
    save_calendar_slots,
    get_calendar_slots,
    send_request,
    get_requests,
    accept_request,
    reject_request
)

urlpatterns = [
    path('users/', users_list),
    path('login/', login_user),
    path('register/', register_user),
    path('update_profile/', update_profile),
    path('metadata/', metadata),
    path('matches/', get_matches),
    path('complete_session/', complete_session),
    path('save_calendar_slots/', save_calendar_slots),
    path('get_calendar_slots/', get_calendar_slots),

    # ✅ REQUEST SYSTEM
    path('send-request/', send_request),
    path('requests/<int:user_id>/', get_requests),
    path('accept-request/', accept_request),
    path('reject-request/', reject_request),
]