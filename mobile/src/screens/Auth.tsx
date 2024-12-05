import React from 'react';
import { PasswordChange } from '@app/modules/auth/PasswordChange';
import { Signin } from '@app/modules/auth/Signin';
import { MobilePasswordReset } from '@app/modules/auth/MobilePasswordReset';
import { PasswordResetVerify } from '@app/modules/auth/PasswordResetVerify';
import { MobileSignup } from '@app/modules/auth/MobileSignup';
import { SignupVerify } from '@app/modules/auth/SignupVerify';
import { MobileSignupVerifyResend } from '@app/modules/auth/MobileSignupVerifyResend';
import { EmailSignup } from '@app/modules/auth/EmailSignup';
import { EmailSignupVerifyResend } from '@app/modules/auth/EmailSignupVerifyResend';
import { EmailPasswordReset } from '@app/modules/auth/EmailPasswordReset';

export const EmailSignupScreen = () => {
  return <EmailSignup />;
};

export const MobileSignupScreen = () => {
  return <MobileSignup />;
};

export const SignupVerifyScreen = () => {
  return <SignupVerify />;
};

export const EmailSignupVerifyResendScreen = () => {
  return <EmailSignupVerifyResend />;
};

export const MobileSignupVerifyResendScreen = () => {
  return <MobileSignupVerifyResend />;
};

export const SigninScreen = () => {
  return <Signin />;
};

export const PasswordChangeScreen = () => {
  return <PasswordChange />;
};

export const EmailPasswordResetScreen = () => {
  return <EmailPasswordReset />;
};

export const MobilePasswordResetScreen = () => {
  return <MobilePasswordReset />;
};

export const PasswordResetVerifyScreen = () => {
  return <PasswordResetVerify />;
};
