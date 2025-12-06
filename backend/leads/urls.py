from django.urls import path
from . import views

urlpatterns = [
    path('', views.leads_list_view, name='leads_list'),
    path('<int:lead_id>/', views.lead_detail_view, name='lead_detail'),
]
