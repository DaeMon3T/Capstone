
# urls.py (in your authentication app)
from django.urls import path
from .views import SendOTPView, VerifyOTPView, CompleteSignupView, LoginView, CustomTokenObtainPairView


urlpatterns = [
    path('send-otp/', SendOTPView.as_view(), name='send-otp'),
    path('verify-otp/', VerifyOTPView.as_view(), name='verify-otp'),
    path('complete-signup/', CompleteSignupView.as_view(), name='complete-signup'),
    path('auth/login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
]