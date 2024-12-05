from django.contrib.auth import get_user_model, authenticate
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.views import APIView
from rest_framework.authtoken.models import Token
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from django.db.models import Q, F, Count
from django.db.models.functions import ExtractYear, ExtractMonth
from django.http import HttpRequest, HttpResponse

from .models import (
    User, OTPCode
)
from .serializers import (
    EmailSignupSerializer, MobileSignupSerializer, SignupVerifySerializer,
    EmailSignupVerifyResendSerializer, MobileSignupVerifyResendSerializer,
    SigninSerializer, EmailPasswordResetSerializer, MobilePasswordResetSerializer,
    PasswordChangeSerializer, PasswordResetVerifiedSerializer,
    EmailUserSerializer, MobileUserSerializer
)


def welcome(request: HttpRequest) -> HttpResponse:
    return HttpResponse("Welcome to API.")


class EmailSignupView(APIView):
    permission_classes = (AllowAny,)
    serializer_class = EmailSignupSerializer

    def post(self, request, format=None):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            username = serializer.data['username']
            email = serializer.data['email']
            password = serializer.data['password']

            try:
                user = get_user_model().objects.get(username=username)
                if user.is_verified:
                    response = {'message': 'User is already verified'}
                    return Response(response, status=status.HTTP_400_BAD_REQUEST)
                try:
                    otp_code = OTPCode.objects.get(user=user)
                    otp_code.delete()
                except OTPCode.DoesNotExist:
                    pass

            except get_user_model().DoesNotExist:
                user = get_user_model().objects.create_user(username=username)

            user.set_password(password)
            user.email = email

            user.save()
            ipaddr = self.request.META.get('REMOTE_ADDR', '0.0.0.0')
            otp_code = OTPCode.objects.create_otp_code(user, ipaddr)
            otp_code.send_otp_email()

            response = {
                'message': 'Success!',
                'username': username,
                'email': email,
                'password': password,
                'otp': otp_code.code
            }

            return Response(response, status=status.HTTP_200_OK)
        else:
            response = {'message': serializer.errors}
            return Response(response, status=status.HTTP_400_BAD_REQUEST)


class MobileSignupView(APIView):
    permission_classes = (AllowAny,)
    serializer_class = MobileSignupSerializer

    def post(self, request, format=None):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            username = serializer.data['username']
            mobile = serializer.data['mobile']
            password = serializer.data['password']

            try:
                user = get_user_model().objects.get(username=username)
                if user.is_verified:
                    response = {'message': 'User is already verified'}
                    return Response(response, status=status.HTTP_400_BAD_REQUEST)
                try:
                    otp_code = OTPCode.objects.get(user=user)
                    otp_code.delete()
                except OTPCode.DoesNotExist:
                    pass

            except get_user_model().DoesNotExist:
                user = get_user_model().objects.create_user(username=username)

            user.set_password(password)
            user.mobile = mobile

            user.save()
            ipaddr = self.request.META.get('REMOTE_ADDR', '0.0.0.0')
            otp_code = OTPCode.objects.create_otp_code(user, ipaddr)
            # otp = OTPCode.objects.get(user=user)
            # print('otp:', otp_code.code)
            otp_code.send_otp_sms()
            # otp_code.send_otp_whatsapp()

            response = {
                'message': 'Success!',
                'username': username,
                'mobile': mobile,
                'password': password,
                'otp': otp_code.code
            }

            return Response(response, status=status.HTTP_200_OK)
        else:
            response = {'message': serializer.errors}
            return Response(response, status=status.HTTP_400_BAD_REQUEST)


class SignupVerifyView(APIView):
    permission_classes = (AllowAny,)
    serializer_class = SignupVerifySerializer

    def get(self, request, code, format=None):
        serializer = self.serializer_class(data=request.data)
        verified = OTPCode.objects.set_is_verified(code)

        if verified:
            try:
                otp_code = OTPCode.objects.get(code=code)
                otp_code.delete()
            except OTPCode.DoesNotExist:
                pass
            response = {'message': 'Success!'}
            return Response(response, status=status.HTTP_200_OK)
        else:
            response = {'message': 'Not successful!'}
            return Response(response, status=status.HTTP_400_BAD_REQUEST)


class EmailSignupVerifyResendView(APIView):
    permission_classes = (AllowAny,)
    serializer_class = EmailSignupVerifyResendSerializer

    def post(self, request, format=None):
        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():
            email = serializer.data['email']

            try:
                user = get_user_model().objects.get(email=email)
                OTPCode.objects.filter(user=user).delete()

                if user.is_verified and user.is_active:
                    response = {'message': 'User already verified'}
                    return Response(response, status=status.HTTP_200_OK)
            except get_user_model().DoesNotExist:
                response = {'message': 'User does not exist!'}
                return Response(response, status=status.HTTP_400_BAD_REQUEST)
            
            user = get_user_model().objects.get(email=email)
            ipaddr = self.request.META.get('REMOTE_ADDR', '0.0.0.0')
            otp_code = OTPCode.objects.create_otp_code(user, ipaddr)
            otp_code.send_otp_email()

            response = {'message': 'Code resent', 'otp': otp_code.code}
            return Response(response, status=status.HTTP_200_OK)
        else:
            response = {'message': 'Unable to resend code!'}
            return Response(response, status=status.HTTP_400_BAD_REQUEST)


class MobileSignupVerifyResendView(APIView):
    permission_classes = (AllowAny,)
    serializer_class = MobileSignupVerifyResendSerializer

    def post(self, request, format=None):
        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():
            mobile = serializer.data['mobile']

            try:
                user = get_user_model().objects.get(mobile=mobile)
                OTPCode.objects.filter(user=user).delete()

                if user.is_verified and user.is_active:
                    response = {'message': 'User already verified'}
                    return Response(response, status=status.HTTP_200_OK)
            except get_user_model().DoesNotExist:
                response = {'message': 'User does not exist!'}
                return Response(response, status=status.HTTP_400_BAD_REQUEST)
            
            user = get_user_model().objects.get(mobile=mobile)
            ipaddr = self.request.META.get('REMOTE_ADDR', '0.0.0.0')
            otp_code = OTPCode.objects.create_otp_code(user, ipaddr)
            otp_code.send_otp_sms()
            # otp_code.send_otp_whatsapp()

            response = {'message': 'Code resent', 'otp': otp_code.code}
            return Response(response, status=status.HTTP_200_OK)
        else:
            response = {'message': 'Unable to resend code!'}
            return Response(response, status=status.HTTP_400_BAD_REQUEST)


class SigninView(APIView):
    permission_classes = (AllowAny,)
    serializer_class = SigninSerializer

    def post(self, request, format=None):
        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():
            username = serializer.data['username']
            password = serializer.data['password']
            user = authenticate(username=username, password=password)

            if user:
                if user.is_verified:
                    if user.is_active:
                        token, created = Token.objects.get_or_create(user=user)
                        return Response(
                            {'token': token.key},
                            status=status.HTTP_200_OK
                        )
                    else:
                        response = {'message': 'Account is not active'}
                        return Response(
                            response,
                            status=status.HTTP_401_UNAUTHORIZED
                        )
                else:
                    response = {'message': 'User account not verified'}
                    return Response(
                        response,
                        status=status.HTTP_401_UNAUTHORIZED
                    )
            else:
                response = {
                    'message': 'Unable to sign in with provided credentials'}
                return Response(
                    response,
                    status=status.HTTP_401_UNAUTHORIZED
                )
        else:
            response = {'message': serializer.errors}
            return Response(response, status=status.HTTP_400_BAD_REQUEST)


class SignoutView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request, format=None):
        tokens = Token.objects.filter(user=request.user)
        for token in tokens:
            token.delete()
        response = {'message': 'User signed out'}
        return Response(response, status=status.HTTP_200_OK)


class PasswordChangeView(APIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = PasswordChangeSerializer

    def post(self, request, format=None):
        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():
            user = request.user
            password = serializer.data['password']
            user.set_password(password)
            user.save()

            response = {'message': 'Password changed!'}
            return Response(response, status=status.HTTP_200_OK)
        else:
            response = {'message': serializer.errors}
            return Response(response, status=status.HTTP_400_BAD_REQUEST)


class EmailPasswordResetView(APIView):
    permission_classes = (AllowAny,)
    serializer_class = EmailPasswordResetSerializer

    def post(self, request, format=None):
        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():
            email = serializer.data['email']

            try:
                user = get_user_model().objects.get(email=email)
                OTPCode.objects.filter(user=user).delete()

                if user.is_verified and user.is_active:
                    ipaddr = self.request.META.get('REMOTE_ADDR', '0.0.0.0')
                    otp_code = OTPCode.objects.create_otp_code(user, ipaddr)
                    otp_code.send_otp_email()
                    response = {
                        'message': 'Success!',
                        'email': email, 
                        'otp': otp_code.code
                        }
                    return Response(response, status=status.HTTP_200_OK)
            except get_user_model().DoesNotExist:
                response = {'message': 'User does not exist!'}
                return Response(response, status=status.HTTP_400_BAD_REQUEST)
            
            response = {'message': 'Password reset not allowed'}
            return Response(response, status=status.HTTP_400_BAD_REQUEST)
        else:
            response = {'message': serializer.errors}
            return Response(response, status=status.HTTP_400_BAD_REQUEST)


class MobilePasswordResetView(APIView):
    permission_classes = (AllowAny,)
    serializer_class = MobilePasswordResetSerializer

    def post(self, request, format=None):
        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():
            mobile = serializer.data['mobile']

            try:
                user = get_user_model().objects.get(mobile=mobile)
                OTPCode.objects.filter(user=user).delete()

                if user.is_verified and user.is_active:
                    ipaddr = self.request.META.get('REMOTE_ADDR', '0.0.0.0')
                    otp_code = OTPCode.objects.create_otp_code(user, ipaddr)
                    otp_code.send_otp_sms()
                    # otp_code.send_otp_whatsapp()
                    response = {
                        'message': 'Success!',
                        'mobile': mobile, 
                        'otp': otp_code.code
                        }
                    return Response(response, status=status.HTTP_200_OK)
            except get_user_model().DoesNotExist:
                response = {'message': 'User does not exist!'}
                return Response(response, status=status.HTTP_400_BAD_REQUEST)
            response = {'message': 'Password reset not allowed'}
            return Response(response, status=status.HTTP_400_BAD_REQUEST)
        else:
            response = {'message': serializer.errors}
            return Response(response, status=status.HTTP_400_BAD_REQUEST)


class PasswordResetVerifyView(APIView):
    permission_classes = (AllowAny,)
    serializer_class = PasswordResetVerifiedSerializer

    def post(self, request, format=None):
        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():
            code = serializer.data['code']
            password = serializer.data['password']

            try:
                otp_code = OTPCode.objects.get(code=code)
                otp_code.user.set_password(password)
                otp_code.user.save()

                otp_code.delete()

                response = {'message': 'Success!'}
                return Response(response, status=status.HTTP_200_OK)
            except OTPCode.DoesNotExist:
                response = {'message': 'Could not verify user'}
                return Response(response, status=status.HTTP_400_BAD_REQUEST)
        else:
            response = {'message': serializer.errors}
            return Response(response, status=status.HTTP_400_BAD_REQUEST)


class EmailUserView(APIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = EmailUserSerializer

    def get(self, request, format=None):
        return Response(self.serializer_class(request.user).data)


class MobileUserView(APIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = MobileUserSerializer

    def get(self, request, format=None):
        return Response(self.serializer_class(request.user).data)


@api_view(['GET'])
def users_count_by_date_joined(request, sdate, edate):
    data = User.objects \
        .filter(is_deleted=False, date_joined__range=(sdate, edate)) \
        .annotate(Year=ExtractYear('date_joined'), Month=ExtractMonth('date_joined')).values('Year', 'Month') \
        .annotate(
            Items=Count('id')) \
        .values('Year', 'Month', 'Items').order_by('Year', 'Month')
    return Response(data)

@api_view(['GET'])
def users_list_by_date_joined(request, sdate, edate):
    data = User.objects \
        .filter(is_deleted=False, date_joined__range=(sdate, edate)) \
        .annotate(Year=ExtractYear('date_joined'), Month=ExtractMonth('date_joined')).values('Year', 'Month') \
        .annotate(ID=F('id')).values('Year', 'Month', 'ID') \
        .annotate(UserName=F('username')).values('Year', 'Month', 'ID', 'UserName') \
        .annotate(DateJoined=F('date_joined')).values('Year', 'Month', 'ID', 'UserName', 'DateJoined') \
        .values('Year', 'Month', 'ID', 'UserName', 'DateJoined').order_by('Year', 'Month')
    return Response(data)