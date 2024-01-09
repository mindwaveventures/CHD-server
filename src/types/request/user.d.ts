interface CreateUser {
  email: string;
  firstName: string;
  lastName?: string;
  trustId: string;
  usertype?: string;
  status?: string;
  termsAndConditions?: boolean;
  password?: string;
  salt?: string;
  mobileNo?: string;
  otp?: string;
  otpExpiryDate?: Date;
  authEmail?: boolean;
  authSMS?: boolean;
}

interface SignUpWithNewTrust {
  name: string;
  firstName: string;
  lastName?: string;
  newPassword: string;
  confirmPassword: string;
  email: string;
  otp: string;
}

interface VerifyTrustTwoStepVerification {
  name: string;
  firstName: string;
  lastName?: string;
  email: string;
  newPassword: string;
  confirmPassword: string;
  authSMS: boolean;
  authEmail: boolean;
  phone: string;
}

interface SignUpWithExistingTrust {
  email: string;
  otp: string;
  trustId: string;
  firstName: string;
  lastName?: string;
  newPassword: string;
  confirmPassword: string;
  OTPType: string;
}

interface Signin {
  id: string;
  otp?: string;
}

interface TwoFactorAuthentication {
  email: string;
  password: string;
}

interface CreateOrChangePassword {
  id: string;
  newPassword: string;
  confirmPassword: string;
}

interface ManageTrustRequest {
  trustId: string;
  status: string;
  reason?: string;
}

interface ManageUserRequest {
  userid: string;
  status: string;
  reason?: string;
}

interface UpdateUsers {
  status?: string;
  reason?: string;
  accessToken?: string;
  password?: string;
  salt?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  otp?: string;
  otpExpiryDate?: Date;
  mobileNo?: string;
  authEmail?: boolean;
  authSMS?: boolean;
  usertype?: string;
  passwordAttempt?: number;
  passwordAttemptExpired?: Date;
}

interface VerifyTwoStepAuthentication {
  emailAuth: boolean;
  smsAuth: boolean;
  email: string;
  phone?: string;
  trustId: string;
  firstName: string;
  lastName?: string;
  newPassword: string;
  confirmPassword: string;
}

interface ResendOTP {
  email: string;
  authEmail: boolean;
  authSMS: boolean;
  OTPType: string;
}

interface SetPassword {
  id: string;
  newPassword: string;
  confirmPassword: string;
  mobileNo?: string;
  authEmail: boolean;
  authSMS: boolean;
}

interface VerifyTwoStepAuthenticationSignin {
  id: string;
  otp: string;
  newPassword: string;
  confirmPassword: string;
}

interface ChangeRole {
  id: string;
  usertype: string;
  name: string;
}

interface ManageTwoFactorAuthentication {
  email: string;
  mobileNo: string;
  authEmail: boolean;
  authSMS: boolean;
  otp: string;
}

export {
  CreateUser,
  Signin,
  CreateOrChangePassword,
  SignUpWithNewTrust,
  ManageTrustRequest,
  ManageUserRequest,
  SignUpWithExistingTrust,
  UpdateUsers,
  VerifyTwoStepAuthentication,
  VerifyTrustTwoStepVerification,
  ResendOTP,
  SetPassword,
  VerifyTwoStepAuthenticationSignin,
  TwoFactorAuthentication,
  ChangeRole,
  ManageTwoFactorAuthentication,
};
