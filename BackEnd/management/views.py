# management/views.py
from rest_framework import status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.contrib.auth.models import User
from django.db.models import Q, Count
from django.utils import timezone
from django.contrib.sessions.models import Session

from .models import UserInvitation, SystemActivity
from .serializers import (
    UserInvitationSerializer, InviteUserSerializer, 
    SystemActivitySerializer, DashboardStatsSerializer, UserSearchSerializer
)
from .email_service import EmailService

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def invite_user(request):
    """Send invitation to a new user"""
    serializer = InviteUserSerializer(data=request.data)
    
    if serializer.is_valid():
        email = serializer.validated_data['email']
        role = serializer.validated_data['role']
        
        # Create invitation
        invitation = UserInvitation.objects.create(
            email=email,
            role=role,
            invited_by=request.user
        )
        
        # Send invitation email
        email_sent = EmailService.send_invitation_email(invitation)
        
        if email_sent:
            # Log activity
            SystemActivity.objects.create(
                activity_type='user_invited',
                description=f"Invited {email} as {role}",
                user=request.user,
                metadata={'email': email, 'role': role}
            )
            
            return Response({
                'success': True,
                'message': 'Invitation sent successfully',
                'invitation': UserInvitationSerializer(invitation).data
            }, status=status.HTTP_201_CREATED)
        else:
            # Delete invitation if email failed
            invitation.delete()
            return Response({
                'success': False,
                'message': 'Failed to send invitation email'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    return Response({
        'success': False,
        'errors': serializer.errors
    }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def dashboard_stats(request):
    """Get dashboard statistics"""
    
    # Count users by type - you may need to adjust based on your user model structure
    total_patients = User.objects.filter(groups__name='Patient').count()
    total_doctors = User.objects.filter(groups__name='Doctor').count()
    total_staff = User.objects.filter(groups__name='Staff').count()
    
    # Count appointments (assuming you have an appointment model)
    total_appointments = 0
    try:
        from appointment.models import Appointment  # Adjust import as needed
        total_appointments = Appointment.objects.count()
    except ImportError:
        pass
    
    # Pending invitations
    pending_invites = UserInvitation.objects.filter(status='pending').count()
    
    # Active sessions
    active_sessions = Session.objects.filter(expire_date__gte=timezone.now()).count()
    
    # Pending approvals (you can adjust this logic based on your needs)
    pending_approvals = UserInvitation.objects.filter(status='pending').count()
    
    stats_data = {
        'total_patients': total_patients,
        'total_doctors': total_doctors,
        'total_staff': total_staff,
        'total_appointments': total_appointments,
        'pending_approvals': pending_approvals,
        'active_sessions': active_sessions,
        'pending_invites': pending_invites,
    }
    
    serializer = DashboardStatsSerializer(stats_data)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def recent_activities(request):
    """Get recent system activities"""
    activities = SystemActivity.objects.all()[:20]  # Last 20 activities
    serializer = SystemActivitySerializer(activities, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def search_users(request):
    """Search for users across the system"""
    query = request.GET.get('q', '').strip()
    
    if not query:
        return Response([])
    
    # Search in users
    users = User.objects.filter(
        Q(first_name__icontains=query) |
        Q(last_name__icontains=query) |
        Q(email__icontains=query)
    )[:10]  # Limit results
    
    serializer = UserSearchSerializer(users, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def pending_invitations(request):
    """Get all pending invitations"""
    invitations = UserInvitation.objects.filter(status='pending')
    serializer = UserInvitationSerializer(invitations, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def resend_invitation(request, invitation_id):
    """Resend an invitation email"""
    try:
        invitation = UserInvitation.objects.get(id=invitation_id, status='pending')
        
        # Update expiration date
        invitation.expires_at = timezone.now() + timezone.timedelta(days=7)
        invitation.save()
        
        # Resend email
        email_sent = EmailService.send_invitation_email(invitation)
        
        if email_sent:
            return Response({
                'success': True,
                'message': 'Invitation resent successfully'
            })
        else:
            return Response({
                'success': False,
                'message': 'Failed to resend invitation email'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
    except UserInvitation.DoesNotExist:
        return Response({
            'success': False,
            'message': 'Invitation not found'
        }, status=status.HTTP_404_NOT_FOUND)

@api_view(['DELETE'])
@permission_classes([permissions.IsAuthenticated])
def cancel_invitation(request, invitation_id):
    """Cancel a pending invitation"""
    try:
        invitation = UserInvitation.objects.get(id=invitation_id, status='pending')
        invitation.status = 'expired'
        invitation.save()
        
        return Response({
            'success': True,
            'message': 'Invitation cancelled successfully'
        })
        
    except UserInvitation.DoesNotExist:
        return Response({
            'success': False,
            'message': 'Invitation not found'
        }, status=status.HTTP_404_NOT_FOUND)