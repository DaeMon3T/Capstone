from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone
import random
import string
from addresses.models import Province, CityMunicipality, Address

class User(AbstractUser):
    # User Types/Roles
    USER_TYPE_CHOICES = [
        ('admin', 'Admin'),
        ('doctor', 'Doctor'),
        ('staff', 'Staff'),
        ('patient', 'Patient'),
    ]
    
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=30)
    middle_name = models.CharField(max_length=30, blank=True, null=True)
    last_name = models.CharField(max_length=30)
    contact_number = models.CharField(max_length=15, blank=True)
    sex = models.CharField(max_length=1, choices=[('M', 'Male'), ('F', 'Female')], blank=True)
    date_of_birth = models.DateField(null=True, blank=True)
    address = models.ForeignKey('addresses.Address', on_delete=models.SET_NULL, null=True, blank=True)
    is_email_verified = models.BooleanField(default=False)
    
    # Role/User Type field
    user_type = models.CharField(
        max_length=10, 
        choices=USER_TYPE_CHOICES, 
        default='patient',
        help_text="User role in the system"
    )
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name', 'user_type']
    
    def get_full_name(self):
        """Return the full name including middle name if available"""
        if self.middle_name:
            return f"{self.first_name} {self.middle_name} {self.last_name}"
        return f"{self.first_name} {self.last_name}"
    
    def is_admin(self):
        return self.user_type == 'admin' or self.is_superuser
    
    def is_doctor(self):
        return self.user_type == 'doctor'
    
    def is_staff_member(self):
        return self.user_type == 'staff'
    
    def is_patient(self):
        return self.user_type == 'patient'
    
    def __str__(self):
        return f"{self.get_full_name()} ({self.get_user_type_display()})"

# class Province(models.Model):
#     name = models.CharField(max_length=100)
    
#     def __str__(self):
#         return self.name

# class CityMunicipality(models.Model):
#     name = models.CharField(max_length=100)
#     zip_code = models.CharField(max_length=10, blank=True)
#     province = models.ForeignKey(Province, on_delete=models.CASCADE)
    
#     def __str__(self):
#         return self.name

# class Address(models.Model):
#     street = models.CharField(max_length=200)
#     barangay = models.CharField(max_length=100)
#     city_municipality = models.ForeignKey(CityMunicipality, on_delete=models.CASCADE)
    
#     def __str__(self):
#         return f"{self.street}, {self.barangay}, {self.city_municipality.name}"

class OTPVerification(models.Model):
    email = models.EmailField()
    otp_code = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)
    is_used = models.BooleanField(default=False)
    expires_at = models.DateTimeField()
    
    def save(self, *args, **kwargs):
        if not self.expires_at:
            self.expires_at = timezone.now() + timezone.timedelta(minutes=10)
        super().save(*args, **kwargs)
    
    def is_expired(self):
        return timezone.now() > self.expires_at
    
    @staticmethod
    def generate_otp():
        return ''.join(random.choices(string.digits, k=6))
    
    class Meta:
        ordering = ['-created_at']

def send_otp(email):
    """Send OTP to email address"""
    # Invalidate old OTPs for this email
    OTPVerification.objects.filter(email=email, is_used=False).update(is_used=True)
    
    # Generate a new OTP
    otp_code = OTPVerification.generate_otp()
    otp = OTPVerification.objects.create(
        email=email,
        otp_code=otp_code,
        expires_at=timezone.now() + timezone.timedelta(minutes=10)
    )
    
    # Send OTP via email
    from django.core.mail import send_mail
    from django.conf import settings
    send_mail(
        subject="Your OTP Code - BukCare",
        message=f"Your OTP code is {otp_code}. It will expire in 10 minutes.",
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[email],
    )
    
    return otp