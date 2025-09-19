from django.db import models
from django.conf import settings   # ✅ use this instead of importing User
from django.utils import timezone
import uuid

class UserInvitation(models.Model):
    ROLE_CHOICES = [
        ('doctor', 'Doctor'),
        ('staff', 'Staff'),
    ]
    
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('accepted', 'Accepted'),
        ('expired', 'Expired'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField()
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    
    invited_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,   # ✅ replaced User
        on_delete=models.CASCADE,
        related_name='sent_invitations'
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    accepted_at = models.DateTimeField(null=True, blank=True)
    
    accepted_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,   # ✅ replaced User
        on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name='accepted_invitations'
    )
    
    class Meta:
        unique_together = ['email', 'role']
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Invitation to {self.email} as {self.role}"
    
    @property
    def is_expired(self):
        return timezone.now() > self.expires_at
    
    def save(self, *args, **kwargs):
        if not self.expires_at:
            # Set expiration to 7 days from now
            self.expires_at = timezone.now() + timezone.timedelta(days=7)
        super().save(*args, **kwargs)


class SystemActivity(models.Model):
    ACTIVITY_TYPES = [
        ('user_invited', 'User Invited'),
        ('user_registered', 'User Registered'),
        ('user_login', 'User Login'),
        ('appointment_created', 'Appointment Created'),
        ('appointment_cancelled', 'Appointment Cancelled'),
    ]
    
    activity_type = models.CharField(max_length=30, choices=ACTIVITY_TYPES)
    description = models.TextField()
    
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,   # ✅ replaced User
        on_delete=models.SET_NULL,
        null=True, blank=True
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    metadata = models.JSONField(default=dict, blank=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name_plural = "System Activities"
    
    def __str__(self):
        return f"{self.activity_type} - {self.description[:50]}"
