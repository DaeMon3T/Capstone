# # doctors/models.py
# from django.db import models
# from authentication.models import User
# from addresses.models import Address

# class Specialization(models.Model):
#     name = models.CharField(max_length=100)
#     description = models.TextField(blank=True)
    
#     def __str__(self):
#         return self.name

# class Doctor(models.Model):
#     user = models.OneToOneField(User, on_delete=models.CASCADE, limit_choices_to={'user_type': 'doctor'})
#     specialization = models.ForeignKey(Specialization, on_delete=models.CASCADE)
#     license_number = models.CharField(max_length=50, unique=True)
#     clinic_address = models.ForeignKey(Address, on_delete=models.SET_NULL, null=True, blank=True)
#     consultation_fee = models.DecimalField(max_digits=10, decimal_places=2)
#     is_available = models.BooleanField(default=True)
    
#     def __str__(self):
#         return f"Dr. {self.user.get_full_name()}"