from django.urls import path
from . import views

urlpatterns = [
    path('', views.clientes_list_view, name='clientes_list'),
    path('<int:cliente_id>/', views.cliente_detail_view, name='cliente_detail'),
]
