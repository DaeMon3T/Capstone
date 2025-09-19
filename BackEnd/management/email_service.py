# management/email_service.py
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.conf import settings
from django.urls import reverse
import logging

logger = logging.getLogger(__name__)

class EmailService:
    @staticmethod
    def send_invitation_email(invitation):
        """Send invitation email to the user"""
        try:
            # Create invitation link
            invitation_url = f"{settings.FRONTEND_URL}/invitation/{invitation.id}/"
            
            # Email context
            context = {
                'invitation': invitation,
                'invitation_url': invitation_url,
                'site_name': 'BukCare',
                'expires_in_days': 1,
            }
            
            # Render email templates
            subject = f"You're invited to join BukCare as a {invitation.role.title()}"
            html_message = render_to_string('emails/invitation.html', context)
            plain_message = render_to_string('emails/invitation.txt', context)
            
            # Send email
            send_mail(
                subject=subject,
                message=plain_message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[invitation.email],
                html_message=html_message,
                fail_silently=False,
            )
            
            logger.info(f"Invitation email sent to {invitation.email}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to send invitation email to {invitation.email}: {str(e)}")
            return False

    @staticmethod
    def send_welcome_email(user):
        """Send welcome email after user accepts invitation"""
        try:
            context = {
                'user': user,
                'site_name': 'BukCare',
                'login_url': f"{settings.FRONTEND_URL}/login/",
            }
            
            subject = "Welcome to BukCare!"
            html_message = render_to_string('emails/welcome.html', context)
            plain_message = render_to_string('emails/welcome.txt', context)
            
            send_mail(
                subject=subject,
                message=plain_message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[user.email],
                html_message=html_message,
                fail_silently=False,
            )
            
            logger.info(f"Welcome email sent to {user.email}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to send welcome email to {user.email}: {str(e)}")
            return False