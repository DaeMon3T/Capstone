from django.contrib import admin
from .models import User, Province, CityMunicipality, Address, OTPVerification

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ['email', 'first_name', 'last_name', 'contact_number', 'sex', 'is_email_verified']
    list_filter = ['sex', 'is_email_verified', 'date_joined']
    search_fields = ['email', 'first_name', 'last_name', 'contact_number']
    readonly_fields = ['date_joined', 'last_login']

# @admin.register(Province)
# class ProvinceAdmin(admin.ModelAdmin):
#     list_display = ['name']
#     search_fields = ['name']

# @admin.register(CityMunicipality)
# class CityMunicipalityAdmin(admin.ModelAdmin):
#     list_display = ['name', 'province', 'zip_code']
#     list_filter = ['province']
#     search_fields = ['name', 'zip_code']

# @admin.register(Address)
# class AddressAdmin(admin.ModelAdmin):
#     list_display = ['street', 'barangay', 'city_municipality']
#     search_fields = ['street', 'barangay']
#     list_filter = ['city_municipality__province']

# @admin.register(OTPVerification)
# class OTPVerificationAdmin(admin.ModelAdmin):
#     list_display = ['email', 'otp_code', 'created_at', 'expires_at', 'is_used']
#     list_filter = ['is_used', 'created_at']
#     search_fields = ['email']
#     readonly_fields = ['created_at']