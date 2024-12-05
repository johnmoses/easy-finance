from django.urls import path
from .views import (
    welcome,
    EmailSignupView, MobileSignupView, SignupVerifyView, 
    EmailSignupVerifyResendView, MobileSignupVerifyResendView,
    SigninView, SignoutView, PasswordChangeView, 
    EmailPasswordResetView, MobilePasswordResetView,
    PasswordResetVerifyView, EmailUserView, MobileUserView,
    users_count_by_date_joined, users_list_by_date_joined
)

urlpatterns = [
    path("", welcome, name="welcome"),
    path('email-signup/', EmailSignupView.as_view(), name='email-signup'),
    path('mobile-signup/', MobileSignupView.as_view(), name='mobile-signup'),
    path('signup-verify/<code>/', SignupVerifyView.as_view(), name='signup-verify'),
    path('email-signup-verify-resend/', EmailSignupVerifyResendView.as_view(), name='email-signup-verify-resend'),
    path('mobile-signup-verify-resend/', MobileSignupVerifyResendView.as_view(), name='mobile-signup-verify-resend'),
    path('signin/', SigninView.as_view(), name='signin'),
    path('signout/', SignoutView.as_view(), name='signout'),
    path('password-change/', PasswordChangeView.as_view(), name='password-change'),
    path('email-password-reset/', EmailPasswordResetView.as_view(), name='email-password-reset'),
    path('mobile-password-reset/', MobilePasswordResetView.as_view(), name='mobile-password-reset'),
    path('password-reset-verify/', PasswordResetVerifyView.as_view(),
         name='password-reset-verify'),
    path('email-user/', EmailUserView.as_view(), name='email-user'),
    path('mobile-user/', MobileUserView.as_view(), name='mobile-user'),
    path('users/count/sdate/<sdate>/edate/<edate>/', users_count_by_date_joined, name='users-count-by-date'),
    path('users/list/sdate/<sdate>/edate/<edate>/', users_list_by_date_joined, name='users-list-by-date'),
]