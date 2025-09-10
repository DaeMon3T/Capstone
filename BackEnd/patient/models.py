# # patients/models.py
# from django.db import models
# from authentication.models import User

# class Patient(models.Model):
#     user = models.OneToOneField(User, on_delete=models.CASCADE, limit_choices_to={'user_type': 'patient'})
#     emergency_contact = models.CharField(max_length=15)
#     emergency_contact_name = models.CharField(max_length=100)
#     blood_type = models.CharField(max_length=3, blank=True)
#     allergies = models.TextField(blank=True)
#     medical_history = models.TextField(blank=True)
    
#     def __str__(self):
#         return self.user.get_full_name()