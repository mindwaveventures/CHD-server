import httpstatus from "./httpstatus";

export default {
  noDataFound: {
    message: "No data found",
    errorCode: "NoDataFound",
    statusCode: httpstatus.NotFound,
  },
  invalidUser: {
    message: "User already exist",
    errorCode: "InvalidUser",
    statusCode: httpstatus.BadRequest,
  },
  userNotFound: {
    message: "User not found",
    errorCode: "UserNotFound",
    statusCode: httpstatus.BadRequest,
  },
  invalidUsernameOrPassword: {
    message: "Invalid Email or Password",
    errorCode: "InvalidUsernameOrPassword",
    statusCode: httpstatus.BadRequest,
  },
  passwordNotMatch: {
    message: "Password Not Match",
    errorCode: "PasswordNotMatch",
    statusCode: httpstatus.BadRequest,
  },
  invalidTrust: {
    message: "Trust already exist",
    errorCode: "InvalidTrust",
    statusCode: httpstatus.BadRequest,
  },
  trustNotFound: {
    message: "Trust not found",
    errorCode: "TrustNotFound",
    statusCode: httpstatus.NotFound,
  },
  userNotApproved: {
    message: "User not approved",
    errorCode: "UserNotApproved",
    statusCode: httpstatus.NotFound,
  },
  trustNotApproved: {
    message: "Trust not approved",
    errorCode: "TrustNotApproved",
    statusCode: httpstatus.NotFound,
  },
  trustArchived: {
    message: "Your Trust was archived",
    errorCode: "TrustArchived",
    statusCode: httpstatus.BadRequest,
  },
  userArchived: {
    message: "User was archived",
    errorCode: "UserArchived",
    statusCode: httpstatus.BadRequest,
  },
  userRejected: {
    message: "User was rejected",
    errorCode: "UserRejected",
    statusCode: httpstatus.BadRequest,
  },
  invalidOTP: {
    message: "Invalid OTP",
    errorCode: "InvalidOTP",
    statusCode: httpstatus.BadRequest,
  },
  expiredOTP: {
    message: "OTP Expired",
    errorCode: "ExpiredOTP",
    statusCode: httpstatus.BadRequest,
  },
  minAdminRequired: {
    message: "Minimum one admin required",
    errorCode: "MinimumAdmin",
    statusCode: httpstatus.BadRequest,
  },
  roleChanged: {
    message: "Role Changed Successfully",
    errorCode: "RoleChanged",
    statusCode: httpstatus.BadRequest,
  },
  noStorageAccount: {
    message: "Storage Account not found, please contact administrator",
    errorCode: "NoStorageAccount",
    statusCode: httpstatus.BadRequest,
  },
  predictionExpired: {
    message: "Link has been expired",
    errorCode: "LinkExpired",
    statusCode: httpstatus.BadRequest,
  },
  passwordAttemptFailed: {
    message: `Your last 3 login attempts didn't match your credentials. You're account has been temporarily locked. Please try again after 10 minutes.`,
    errorCode: "PasswordAttemptFailed",
    statusCode: httpstatus.BadRequest,
  },
  resetTokenMismatch: {
    message: "Link not available",
    errorCode: "ResetTokenMismatch",
    statusCode: httpstatus.BadRequest,
  },
  storageAccountCreationInprogress: {
    message: "Storage account request has been already made",
    errorCode: "StorageAccountRequstMadeAlready",
    statusCode: httpstatus.BadRequest,
  },
  storageAccountExist: {
    message: "Storage account already exist",
    errorCode: "StorageAccountAlreadyExist",
    statusCode: httpstatus.BadRequest,
  },
  unAuthorized: {
    message: "Unauthorized request",
    errorCode: "Unauthroized",
    statusCode: httpstatus.Unauthorized,
  },
  invalidOTPType: {
    message: "Invalid OTP Type",
    errorCode: "InvalidOTPType",
    statusCode: httpstatus.Unauthorized,
  },
  invalidRole: {
    message: "Invalid Role",
    errorCode: "InvalidRole",
    statusCode: httpstatus.BadRequest,
  },
};
