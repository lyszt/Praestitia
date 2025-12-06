from django.urls import path
from .views import concorrentes_list_view, concorrente_detail_view

urlpatterns = [
    path('', concorrentes_list_view, name='concorrentes_list'),
    path('<int:concorrente_id>/', concorrente_detail_view, name='concorrente_detail'),
]
