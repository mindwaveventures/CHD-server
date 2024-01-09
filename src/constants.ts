const usertypes = {
  clinician: "Clinician",
  admin: "Admin",
  superAdmin: "Super Admin",
};

const userStatus = {
  active: "Active",
  delete: "deleted",
  requested: "Request",
  rejected: "Rejected",
  pending: "Pending",
};

const trustStatus = {
  active: "Active",
  request: "Requested",
  rejected: "Rejected",
  archived: "Archived",
  pending: "Pending",
};

const containerNames = {
  historic: "training",
  future: "inference",
  result: "result",
};

const queues = {
  request: "organisation-request-queue",
  result: "organisation-result-queue",
  pipeline: "ah-wnb-queue-pipeline-status-changed",
};

const fileUploadStatus = {
  pending: "Pending",
  completed: "Completed",
  failed: "Failed",
};

const initialOrganisationDetails = {
  organisationName: "Alderhey",
  adminEmail: "admin@alderheyanywhere.com",
};

const storageAccountCreationTime = 30;

const resourceDocumentContainer = {
  adminContainer: "admin-resource-documents",
  superAdminContainer: "super-admin-resource-documents",
  userContainer: "user-resource-documents",
  commonContainer: "common-resource-documents",
};

const otpVerificationType = {
  loginVerification: "Login-verification",
  accountVerification: "Account-verification",
  forgotPasswordVerification: "Forgot-password-verification",
  trustVerification: "Trust-verification",
  setNewAccountPassword: "Set-account-password-verification",
};

export {
  usertypes,
  userStatus,
  trustStatus,
  containerNames,
  queues,
  fileUploadStatus,
  initialOrganisationDetails,
  storageAccountCreationTime,
  resourceDocumentContainer,
  otpVerificationType,
};
