import Joi from "@hapi/joi";

const signIn = Joi.object({
  id: Joi.string().required().label("Id"),
  otp: Joi.string().optional().allow("").label("OTP"),
});

const adSignIn = Joi.object({
  accessToken: Joi.string().required().label("Access token"),
});

const twoFactorAuthentication = Joi.object({
  email: Joi.string().required().label("Email"),
  password: Joi.string().required().label("Password"),
});

const signUpNewTrust = Joi.object({
  firstName: Joi.string().required().label("First Name"),
  lastName: Joi.string().optional().label("Last Name"),
  newPassword: Joi.string().regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*?])[A-Za-z\d#$@!%&*?]{8,30}$/,
    "Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special case character"
  ).required().label("New Password"),
  confirmPassword: Joi.string().regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*?])[A-Za-z\d#$@!%&*?]{8,30}$/,
    "Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special case character"
  ).required().label("Confirm Password"),
  otp: Joi.string().allow("").required().label("OTP"),
  email: Joi.string().required().label("Email"),
  name: Joi.string().required().label("Organisation Name"),
});

const VerifyTrustTwoStepAuthentication = Joi.object({
  firstName: Joi.string().required().label("First Name"),
  lastName: Joi.string().optional().label("Last Name"),
  newPassword: Joi.string().regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*?])[A-Za-z\d#$@!%&*?]{8,30}$/,
    "Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special case character"
  ).required().label("New Password"),
  confirmPassword: Joi.string().regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*?])[A-Za-z\d#$@!%&*?]{8,30}$/,
    "Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special case character"
  ).required().label("Confirm Password"),
  email: Joi.string().required().label("Email"),
  name: Joi.string().required().label("Organisation Name"),
  authEmail: Joi.boolean().label("Email Verification"),
  authSMS: Joi.boolean().label("SMS Verification"),
  phone: Joi.string().allow("").optional().label("Mobile Number"),
});

const verifyTwoStepAuthentication = Joi.object({
  phone: Joi.string().allow("").optional().label("Mobile Number"),
  firstName: Joi.string().required().label("First Name"),
  lastName: Joi.string().optional().label("Last Name"),
  newPassword: Joi.string().regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*?])[A-Za-z\d#$@!%&*?]{8,30}$/,
    "Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special case character"
  ).required().label("New Password"),
  confirmPassword: Joi.string().regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*?])[A-Za-z\d#$@!%&*?]{8,30}$/,
    "Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special case character"
  ).required().label("Confirm Password"),
  email: Joi.string().required().label("Email"),
  emailAuth: Joi.boolean().required().label("Email Auth"),
  smsAuth: Joi.boolean().required().label("SMS Auth"),
  trustId: Joi.string().required().label("Organisation Name"),
});

const setPassword = Joi.object({
  id: Joi.string().required().label("Id"),
  newPassword: Joi.string().regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*?])[A-Za-z\d#$@!%&*?]{8,30}$/,
    "Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special case character"
  ).required().label("New Password"),
  confirmPassword: Joi.string().regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*?])[A-Za-z\d#$@!%&*?]{8,30}$/,
    "Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special case character"
  ).required().label("Confirm Password"),
  mobileNo: Joi.string().optional().allow("").label("Mobile No"),
  authSMS: Joi.boolean().required().label("SMS Verification"),
  authEmail: Joi.boolean().required().label("Email Verification"),
});

const verifyInvitedAccount = Joi.object({
  id: Joi.string().required().label("Id"),
  otp: Joi.string().optional().allow("").label("OTP"),
  newPassword: Joi.string().regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*?])[A-Za-z\d#$@!%&*?]{8,30}$/,
    "Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special case character"
  ).required().label("New Password"),
  confirmPassword: Joi.string().regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*?])[A-Za-z\d#$@!%&*?]{8,30}$/,
    "Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special case character"
  ).required().label("Confirm Password"),
});

const signUpExistingTrust = Joi.object({
  otp: Joi.string().allow("").optional().label("OTP"),
  email: Joi.string().required().label("Email"),
  trustId: Joi.string().required().label("Organisation Name"),
  firstName: Joi.string().required().label("First Name"),
  lastName: Joi.string().optional().label("Last Name"),
  newPassword: Joi.string().regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*?])[A-Za-z\d#$@!%&*?]{8,30}$/,
    "Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special case character"
  ).required().label("New Password"),
  confirmPassword: Joi.string().regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*?])[A-Za-z\d#$@!%&*?]{8,30}$/,
    "Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special case character"
  ).required().label("Confirm Password"),
  OTPType: Joi.string().required().allow("").label("OTP Type"),
});

const createOrChangePassword = Joi.object({
  id: Joi.string().required().label("id"),
  newPassword: Joi.string()
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*?])[A-Za-z\d#$@!%&*?]{8,30}$/,
      "Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special case character"
    )
    .required()
    .label("New Passowrd"),
  confirmPassword: Joi.string()
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*?])[A-Za-z\d#$@!%&*?]{8,30}$/,
      "Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special case character"
    )
    .required()
    .label("Confirm Password"),
});

const getUserByTrustId = Joi.object({
  trustId: Joi.string().required().label("Trust Id"),
  status: Joi.string().optional().label("Status"),
  limit: Joi.number().greater(0).optional().label("Limit"),
  page: Joi.number().greater(0).optional().label("Page"),
  searchText: Joi.string().optional().allow("").label("Search Text"),
});

const manageTurstRequest = Joi.object({
  trustId: Joi.string().required().label("Trust Id"),
  status: Joi.string().required().label("Status"),
  reason: Joi.string().optional().label("Reason for request"),
});

const manageUserRequest = Joi.object({
  userid: Joi.string().required().label("Trust Id"),
  status: Joi.string().required().label("Status"),
  reason: Joi.string().optional().allow("").label("Reason for request"),
});

const manageUsers = Joi.object({
  status: Joi.string().required().label("Status"),
});

const updateProfile = Joi.object({
  firstName: Joi.string().required().label("First name"),
  lastName: Joi.string().required().label("Sur name"),
  // email: Joi.string().optional().label('Email'),
  mobileNo: Joi.string().allow("").optional().label("Mobile Number"),
  // otp: Joi.string().optional().label('otp')
});

const changeRole = Joi.object({
  id: Joi.string().required().label("Id"),
  name: Joi.string().required().label("Trust name"),
  usertype: Joi.string().required().label("Usertype"),
});

const resendOTP = Joi.object({
  email: Joi.string().required().label("Email"),
  authEmail: Joi.boolean().label("Email Verification"),
  authSMS: Joi.boolean().label("SMS Verification"),
  OTPType: Joi.string().label("OTP TYpe"),
});

const manageTwoFactorAuthentication = Joi.object({
  email: Joi.string().required().label("Email"),
  mobileNo: Joi.string().optional().allow("").label("Mobile No"),
  authEmail: Joi.boolean().label("Email Verification"),
  authSMS: Joi.boolean().label("SMS Verification"),
  otp: Joi.string().optional().allow("").label("OTP"),
});

export {
  signIn,
  signUpNewTrust,
  signUpExistingTrust,
  createOrChangePassword,
  getUserByTrustId,
  manageTurstRequest,
  manageUserRequest,
  manageUsers,
  updateProfile,
  verifyTwoStepAuthentication,
  VerifyTrustTwoStepAuthentication,
  resendOTP,
  setPassword,
  verifyInvitedAccount,
  twoFactorAuthentication,
  changeRole,
  manageTwoFactorAuthentication,
  adSignIn,
};
