# # notifications/models.py
# from django.db import models
# from authentication.models import User
# from appointment.models import Appointment

# class Notification(models.Model):
#     TYPE_CHOICES = [
#         ('appointment', 'Appointment'),
#         ('reminder', 'Reminder'),
#         ('system', 'System'),
#     ]
    
#     recipient = models.ForeignKey(User, on_delete=models.CASCADE)
#     sender = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='sent_notifications')
#     appointment = models.ForeignKey(Appointment, on_delete=models.CASCADE, null=True, blank=True)
    
#     title = models.CharField(max_length=200)
#     message = models.TextField()
#     notification_type = models.CharField(max_length=20, choices=TYPE_CHOICES)
#     is_read = models.BooleanField(default=False)
    
#     created_at = models.DateTimeField(auto_now_add=True)
#     updated_at = models.DateTimeField(auto_now=True)