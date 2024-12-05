from django.contrib.auth import get_user_model
from rest_framework import serializers


class EmailSignupSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ('username', 'email', 'password')

class MobileSignupSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ('username', 'mobile', 'password')

class SignupVerifySerializer(serializers.Serializer):
    code = serializers.CharField(max_length=125)

class EmailSignupVerifyResendSerializer(serializers.Serializer):
    email = serializers.EmailField(max_length=255)

class MobileSignupVerifyResendSerializer(serializers.Serializer):
    mobile = serializers.CharField(max_length=100)

class SigninSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=200)
    password = serializers.CharField(max_length=100)

class PasswordChangeSerializer(serializers.Serializer):
    password = serializers.CharField(max_length=125)


class EmailPasswordResetSerializer(serializers.Serializer):
    email = serializers.EmailField(max_length=255)

class MobilePasswordResetSerializer(serializers.Serializer):
    mobile = serializers.CharField(max_length=125)

class PasswordResetVerifiedSerializer(serializers.Serializer):
    code = serializers.CharField(max_length=50)
    password = serializers.CharField(max_length=125)

class EmailUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ('username', 'email')

class MobileUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ('username', 'mobile')