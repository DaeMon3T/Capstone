# management/urls.py
from django.urls import path
from . import views

app_name = 'management'

urlpatterns = [
    # Dashboard endpoints
    path('dashboard/stats/', views.dashboard_stats, name='dashboard_stats'),
    path('dashboard/activities/', views.recent_activities, name='recent_activities'),
    
    # User management endpoints
    path('users/search/', views.search_users, name='search_users'),
    path('users/invite/', views.invite_user, name='invite_user'),
    
    # Invitation management endpoints
    path('invitations/pending/', views.pending_invitations, name='pending_invitations'),
    path('invitations/<uuid:invitation_id>/resend/', views.resend_invitation, name='resend_invitation'),
    path('invitations/<uuid:invitation_id>/cancel/', views.cancel_invitation, name='cancel_invitation'),
]