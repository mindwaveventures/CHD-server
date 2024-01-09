import { authCtrl } from "../controllers";
import { usertypes } from "../constants";
import { authSchema } from "../request-schema";
import {
  requestPayloadValidator,
  auditLog,
  checkUserRolePermission,
  rateLimiter
} from "../middleware";

export default (router: any) => {
  router.post(
    "/signin",
    rateLimiter,
    requestPayloadValidator(authSchema.signIn),
    authCtrl.signIn
  );
  router.post(
    "/ad-signin",
    rateLimiter,
    requestPayloadValidator(authSchema.adSignIn),
    authCtrl.activeDirectoryLogin
  );

  router.post(
    "/signup/new-trust",
    rateLimiter,
    requestPayloadValidator(authSchema.signUpNewTrust),
    authCtrl.signUpWithNewTrust
  );
  router.post(
    "/signup/verify-trust-two-step-authentication",
    rateLimiter,
    requestPayloadValidator(authSchema.VerifyTrustTwoStepAuthentication),
    authCtrl.verifyTrustTwoStepAuthentication
  );
  router.post(
    "/signup/existing-trust",
    rateLimiter,
    requestPayloadValidator(authSchema.signUpExistingTrust),
    authCtrl.signupWithExistingTrust
  );
  router.post(
    "/signup/verify-two-step-authentication",
    rateLimiter,
    requestPayloadValidator(authSchema.verifyTwoStepAuthentication),
    authCtrl.verifyTwoStepAuthentication
  );
  router.post(
    "/signup/set-password",
    rateLimiter,
    requestPayloadValidator(authSchema.setPassword),
    authCtrl.setPassword
  );
  router.post(
    "/signup/verify-invited-account",
    rateLimiter,
    requestPayloadValidator(authSchema.verifyInvitedAccount),
    authCtrl.verifyInvitedAccount
  );

  router.post(
    "/two-step-authentication",
    rateLimiter,
    requestPayloadValidator(authSchema.twoFactorAuthentication),
    authCtrl.twoFactorAuthentication
  );
  router.post(
    "/create-or-change-password",
    requestPayloadValidator(authSchema.createOrChangePassword),
    authCtrl.createOrChangePassword
  );
  router.post(
    "/resend-otp",
    rateLimiter,
    requestPayloadValidator(authSchema.resendOTP),
    authCtrl.resendOTP
  );
  router.post("/resend-otp-by-id/:id/:type", rateLimiter, authCtrl.resendOTPByID);
  router.post(
    "/manage-two-step-verification",
    requestPayloadValidator(authSchema.manageTwoFactorAuthentication),
    authCtrl.manageTwoFactorAuthentication
  );

  router.post(
    "/users/get-users-by-trust",
    checkUserRolePermission([usertypes.admin, usertypes.superAdmin]),
    requestPayloadValidator(authSchema.getUserByTrustId),
    authCtrl.getUsersByTrustId
  );
  router.post(
    "/users/manage-trust-request",
    checkUserRolePermission([usertypes.superAdmin]),
    requestPayloadValidator(authSchema.manageTurstRequest),
    authCtrl.manageTrustRequest
  );
  router.post(
    "/users/manage-user-request",
    checkUserRolePermission([usertypes.admin]),
    requestPayloadValidator(authSchema.manageUserRequest),
    authCtrl.manageUserRequest
  );
  router.get(
    "/users/get-user-name-id-by-trust-id/:trustId",
    checkUserRolePermission([
      usertypes.superAdmin,
      usertypes.admin,
      usertypes.clinician,
    ]),
    authCtrl.getUserNameAndIdByTrustId
  );

  router.put(
    "/users/manage-users/:id",
    checkUserRolePermission([usertypes.admin]),
    requestPayloadValidator(authSchema.manageUsers),
    auditLog,
    authCtrl.manageUsers
  );
  router.put(
    "/users/update-profile",
    requestPayloadValidator(authSchema.updateProfile),
    authCtrl.updateProfile
  );
  router.put(
    "/users/update-role",
    checkUserRolePermission([usertypes.superAdmin]),
    requestPayloadValidator(authSchema.changeRole),
    authCtrl.changeRole
  );

  router.get("/users/get-user-by-id/:id/:code?", authCtrl.getUserById);

  router.put("/forgot-password/:email", rateLimiter, authCtrl.forgotPassword);
  router.post("/verify-otp-by-id/:id/:otp", rateLimiter, authCtrl.verifyOTPById);

  router.post(
    "/support/organisation-creation-request",
    authCtrl.contactSupportForOrganisationCreation
  );
  router.post(
    "/forgot-password/resend-otp/:id",
    rateLimiter,
    authCtrl.forgotPasswordResendOTP
  );

  router.delete("/logout", authCtrl.logout);
};
