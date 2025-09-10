from django.urls import path
from . import views

urlpatterns = [
    path('locations/', views.LocationDataView.as_view(), name='location-data'),
    path('provinces/', views.ProvinceListView.as_view(), name='provinces-list'),
    path('cities/', views.CityMunicipalityListView.as_view(), name='cities-list'),
]