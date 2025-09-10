from django.contrib import admin
from .models import Province, CityMunicipality, Address

@admin.register(Province)
class ProvinceAdmin(admin.ModelAdmin):
    list_display = ['name']
    search_fields = ['name']

@admin.register(CityMunicipality)
class CityMunicipalityAdmin(admin.ModelAdmin):
    list_display = ['name', 'province', 'zip_code']
    list_filter = ['province']
    search_fields = ['name', 'province__name']

@admin.register(Address)
class AddressAdmin(admin.ModelAdmin):
    list_display = ['street', 'barangay', 'city_municipality']
    list_filter = ['city_municipality__province', 'city_municipality']
    search_fields = ['street', 'barangay', 'city_municipality__name']