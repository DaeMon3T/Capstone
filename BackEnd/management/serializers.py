# management/serializers.py
from rest_framework import serializers
from django.contrib.auth.models import User
from .models import UserInvitation, SystemActivity

class UserInvitationSerializer(serializers.ModelSerializer):
    invited_by_name = serializers.CharField(source='invited_by.get_full_name', read_only=True)
    accepted_by_name = serializers.CharField(source='accepted_by.get_full_name', read_only=True)
    is_expired = serializers.ReadOnlyField()
    
    class Meta:
        model = UserInvitation
        fields = [
            'id', 'email', 'role', 'status', 'invited_by_name', 
            'created_at', 'expires_at', 'accepted_at', 'accepted_by_name', 'is_expired'
        ]
        read_only_fields = ['id', 'created_at', 'expires_at', 'accepted_at']

class InviteUserSerializer(serializers.Serializer):
    email = serializers.EmailField()
    role = serializers.ChoiceField(choices=UserInvitation.ROLE_CHOICES)
    
    def validate_email(self, value):
        # Check if user already exists
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        
        # Check if there's already a pending invitation
        if UserInvitation.objects.filter(email=value, status='pending').exists():
            raise serializers.ValidationError("A pending invitation already exists for this email.")
        
        return value

class SystemActivitySerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)
    
    class Meta:
        model = SystemActivity
        fields = ['id', 'activity_type', 'description', 'user_name', 'created_at', 'metadata']

class DashboardStatsSerializer(serializers.Serializer):
    total_patients = serializers.IntegerField()
    total_doctors = serializers.IntegerField()
    total_staff = serializers.IntegerField()
    total_appointments = serializers.IntegerField()
    pending_approvals = serializers.IntegerField()
    active_sessions = serializers.IntegerField()
    pending_invites = serializers.IntegerField()

class UserSearchSerializer(serializers.ModelSerializer):
    role = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'email', 'role']
    
    def get_role(self, obj):
        # Determine user role based on groups or related models
        if hasattr(obj, 'doctor'):
            return 'doctor'
        elif hasattr(obj, 'staff'):
            return 'staff'
        elif hasattr(obj, 'patient'):
            return 'patient'
        return 'user'