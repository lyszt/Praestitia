from django.urls import path
from . import views

urlpatterns = [
    path('login/', views.login_view, name='login'),
    path('register/', views.register_view, name='register'),
    path('validate/', views.validate_token_view, name='validate_token'),
    path('users/', views.users_list_view, name='users_list'),
    path('users/<int:user_id>/', views.user_detail_view, name='user_detail'),
]
