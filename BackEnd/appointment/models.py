# # appointments/models.py
# from django.db import models
# from authentication.models import User
# from doctor.models import Doctor

# class Appointment(models.Model):
#     STATUS_CHOICES = [
#         ('pending', 'Pending'),
#         ('confirmed', 'Confirmed'),
#         ('completed', 'Completed'),
#         ('cancelled', 'Cancelled'),
#     ]
    
#     patient = models.ForeignKey(User, on_delete=models.CASCADE, limit_choices_to={'user_type': 'patient'})
#     doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE)
#     appointment_date = models.DateTimeField()
#     status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
#     notes = models.TextField(blank=True)
#     created_at = models.DateTimeField(auto_now_add=True)
#     updated_at = models.DateTimeField(auto_now=True)
    
#     def __str__(self):
#         return f"{self.patient.get_full_name()} - {self.doctor} on {self.appointment_date}"