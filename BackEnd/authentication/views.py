# views.py
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import permissions
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import LoginSerializer
from django.utils import timezone
from django.db import transaction
from django.core.mail import send_mail
from django.conf import settings
from datetime import datetime
import random
import string

from addresses.models import Address, CityMunicipality, Province
from addresses.serializers import AddressCreateSerializer
from .models import OTPVerification, User

def send_otp(email):
    """
    Send OTP to the given email address
    """
    try:
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
        send_mail(
            subject="Your OTP Code - BukCare",
            message=f"Your OTP code is {otp_code}. It will expire in 10 minutes.",
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[email],
            fail_silently=False,
        )
        
        return otp
        
    except Exception as e:
        print(f"Error in send_otp function: {str(e)}")
        raise e

class SendOTPView(APIView):
    permission_classes = [AllowAny] 
    
    def post(self, request):
        email = request.data.get("email")
        
        if not email:
            return Response({"error": "Email is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        # Check if user already exists
        if User.objects.filter(email=email).exists():
            return Response({"error": "User with this email already exists"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # Generate OTP code
            otp_code = ''.join(random.choices(string.digits, k=6))
            
            # Invalidate old OTPs for this email
            OTPVerification.objects.filter(email=email, is_used=False).update(is_used=True)
            
            # Create new OTP record
            otp_record = OTPVerification.objects.create(
                email=email,
                otp_code=otp_code,
                expires_at=timezone.now() + timezone.timedelta(minutes=10)
            )
            
            # Send OTP via email
            send_mail(
                subject="Your OTP Code - BukCare",
                message=f"Your OTP code is {otp_code}. It will expire in 10 minutes.",
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[email],
                fail_silently=False,
            )
            
            return Response({"message": "OTP sent successfully"}, status=status.HTTP_200_OK)
            
        except Exception as e:
            print(f"Email sending error: {str(e)}")
            return Response({"error": "Failed to send OTP"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class VerifyOTPView(APIView):
    permission_classes = [AllowAny] 
    
    def post(self, request):
        email = request.data.get("email")
        otp_code = request.data.get("otp")

        if not email or not otp_code:
            return Response({"error": "Email and OTP are required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            otp = OTPVerification.objects.filter(
                email=email,
                otp_code=otp_code,
                is_used=False
            ).latest("created_at")
        except OTPVerification.DoesNotExist:
            return Response({"error": "Invalid OTP"}, status=status.HTTP_400_BAD_REQUEST)

        # Check expiration
        if otp.is_expired():
            return Response({"error": "OTP expired"}, status=status.HTTP_400_BAD_REQUEST)

        # Mark as used
        otp.is_used = True
        otp.save()

        return Response({"message": "OTP verified successfully"}, status=status.HTTP_200_OK)

class CompleteSignupView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        try:
            # Extract user data
            email = request.data.get("email")
            username = request.data.get("username")
            first_name = request.data.get("first_name")
            middle_name = request.data.get("middle_name")
            last_name = request.data.get("last_name")
            contact_number = request.data.get("contact_number")
            password = request.data.get("password")
            sex = request.data.get("sex")
            date_of_birth = request.data.get("date_of_birth")
            
            # Extract address data
            address_data = {
                'street': request.data.get("street"),
                'barangay': request.data.get("barangay"),
                'city_municipality': request.data.get("city_municipality"),
                'province': request.data.get("province"),
                'zip_code': request.data.get("zip_code", '')
            }
            
            # Validate required fields (same as before)
            required_fields = {
                "email": email,
                "password": password,
                "first_name": first_name,
                "last_name": last_name,
                "contact_number": contact_number,
                "sex": sex,
                "date_of_birth": date_of_birth
            }
            
            missing_fields = [field for field, value in required_fields.items() if not value]
            if missing_fields:
                return Response({
                    "error": f"Missing required fields: {', '.join(missing_fields)}"
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Validate address using serializer
            address_serializer = AddressCreateSerializer(data=address_data)
            if not address_serializer.is_valid():
                return Response({
                    "error": "Invalid address data",
                    "details": address_serializer.errors
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Rest of validation (OTP check, user exists check, etc.)
            if not OTPVerification.objects.filter(email=email, is_used=True).exists():
                return Response({
                    "error": "Email not verified. Please verify your email first."
                }, status=status.HTTP_400_BAD_REQUEST)
            
            if User.objects.filter(email=email).exists():
                return Response({
                    "error": "User with this email already exists"
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Validate date of birth
            try:
                dob = datetime.strptime(date_of_birth, "%Y-%m-%d").date()
            except ValueError:
                return Response({
                    "error": "Invalid date format for date of birth. Use YYYY-MM-DD format."
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Create user with address
            with transaction.atomic():
                # Create address using serializer
                address = address_serializer.save()
                
                # Create User
                user = User.objects.create_user(
                    username=username or email.split('@')[0],
                    email=email,
                    password=password,
                    first_name=first_name,
                    middle_name=middle_name,
                    last_name=last_name,
                    contact_number=contact_number,
                    sex=sex,
                    date_of_birth=dob,
                    address=address,
                    is_email_verified=True
                )
                
                # Invalidate all OTP records
                OTPVerification.objects.filter(email=email).update(is_used=True)
                
            return Response({
                "message": "Patient account created successfully",
                "user_id": user.id,
                "email": user.email
            }, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            print(f"Error creating patient account: {str(e)}")
            import traceback
            traceback.print_exc()
            return Response({
                "error": f"An error occurred while creating your account: {str(e)}"
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class LoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data["user"]
            refresh = RefreshToken.for_user(user)
            return Response({
                "refresh": str(refresh),
                "access": str(refresh.access_token),
            }, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # Add custom claims if needed
        token['email'] = user.email
        return token

class CustomTokenObtainPairView(TokenObtainPairView):
    permission_classes = (permissions.AllowAny,)  # ← important!
    serializer_class = CustomTokenObtainPairSerializer