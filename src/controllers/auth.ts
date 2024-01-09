import * as express from "express";

import AuthService from "../services/auth";
import { HttpStatus } from "../helpers";

const signIn = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const authService = new AuthService();
  try {
    const data = await authService.signIn(req.body);
    return res.status(HttpStatus.OK).send({ data });
  } catch (err) {
    return next(err);
  }
};

const signUpWithNewTrust = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const authService = new AuthService();
  try {
    await authService.signUpWithNewTrust(req.body);
    return res
      .status(HttpStatus.OK)
      .send({ message: "Request made successfully" });
  } catch (err) {
    return next(err);
  }
};

const verifyTrustTwoStepAuthentication = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const authService = new AuthService();
  try {
    await authService.verifyTrustTwoStepAuthentication(req.body);
    return res.status(HttpStatus.OK).send({ message: "OTP Sent successfully" });
  } catch (err) {
    return next(err);
  }
};

const verifyTwoStepAuthentication = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const authService = new AuthService();
  try {
    await authService.verifyTwoStepAuthentication(req.body);
    return res.status(HttpStatus.OK).send({ message: "OTP Sent Successfully" });
  } catch (err) {
    return next(err);
  }
};

const signupWithExistingTrust = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const authService = new AuthService();
  try {
    await authService.signupWithExistingTrust(req.body);
    return res
      .status(HttpStatus.OK)
      .send({ message: "Request made successfully" });
  } catch (err) {
    return next(err);
  }
};

const twoFactorAuthentication = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const authService = new AuthService();
  try {
    const data = await authService.twoFactorAuthentication(req.body);
    return res.status(HttpStatus.OK).send(data);
  } catch (err) {
    return next(err);
  }
};

const createOrChangePassword = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const authService = new AuthService();
  try {
    await authService.createOrChangePassword(req.body);
    return res
      .status(HttpStatus.OK)
      .send({ message: "Password Changed Successfully" });
  } catch (err) {
    return next(err);
  }
};

const getUsersByTrustId = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const authService = new AuthService();
  try {
    const data = await authService.getUsersByTrustId(req.body);
    return res.status(HttpStatus.OK).send(data);
  } catch (err) {
    return next(err);
  }
};

const manageTrustRequest = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const authService = new AuthService();
  try {
    await authService.manageTrustRequest(req.body);
    return res
      .status(HttpStatus.OK)
      .send({ message: "Request Updated Successfully" });
  } catch (err) {
    return next(err);
  }
};

const manageUserRequest = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const authService = new AuthService();
  try {
    await authService.manageUserRequest(req.body);
    return res
      .status(HttpStatus.OK)
      .send({ message: "Request Updated Successfully" });
  } catch (err) {
    return next(err);
  }
};

const manageUsers = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const authService = new AuthService();
  try {
    await authService.manageUsers(req.params.id, req.body);
    return res
      .status(HttpStatus.OK)
      .send({ message: "User Updated Successfully" });
  } catch (err) {
    return next(err);
  }
};

const updateProfile = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const authService = new AuthService();
  try {
    const data = await authService.updateProfile(req.userid, req.body);
    return res.status(HttpStatus.OK).send(data);
  } catch (err) {
    return next(err);
  }
};

const forgotPassword = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const authService = new AuthService();
  try {
    const data = await authService.forgotPassword(
      req.params.email.toLowerCase()
    );
    return res
      .status(HttpStatus.OK)
      .send({ message: "OTP sent successfully", ...data });
  } catch (err) {
    return next(err);
  }
};

const resendOTP = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const authService = new AuthService();
  try {
    await authService.resendOTP(req.body);
    return res.status(HttpStatus.OK).send({ message: "OTP Sent Successfully" });
  } catch (err) {
    return next(err);
  }
};

const getUserById = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const authService = new AuthService();
  try {
    const data = await authService.getUserById(req.params.id, req.params.code);
    return res.status(HttpStatus.OK).send(data);
  } catch (err) {
    return next(err);
  }
};

const setPassword = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const authService = new AuthService();
  try {
    await authService.setPassword(req.body);
    return res.status(HttpStatus.OK).send({ message: "OTP sent successfully" });
  } catch (err) {
    return next(err);
  }
};

const verifyInvitedAccount = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const authService = new AuthService();
  try {
    await authService.verifyInvitedAccount(req.body);
    return res
      .status(HttpStatus.OK)
      .send({ message: "Account verified successfully" });
  } catch (err) {
    return next(err);
  }
};

const resendOTPByID = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const authService = new AuthService();
  try {
    await authService.resendOTPByID(req.params.id, req.params.type);
    return res.status(HttpStatus.OK).send({ message: "OTP sent successfully" });
  } catch (err) {
    return next(err);
  }
};

const verifyOTPById = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const authService = new AuthService();
  try {
    const data = await authService.verifyOTPById(req.params.id, req.params.otp);
    return res
      .status(HttpStatus.OK)
      .send({ message: "OTP Verified successfully", ...data });
  } catch (err) {
    return next(err);
  }
};

const changeRole = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const authService = new AuthService();
  try {
    await authService.changeRole(req.body);
    return res
      .status(HttpStatus.OK)
      .send({ message: "Role changed successfully" });
  } catch (err) {
    return next(err);
  }
};

const manageTwoFactorAuthentication = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const authService = new AuthService();
  try {
    await authService.manageTwoFactorAuthentication(req.userid, req.body);
    return res.status(HttpStatus.OK).send({
      message: req.body.otp
        ? "Account settings updated successfully"
        : "OTP Sent Successfully",
    });
  } catch (err) {
    return next(err);
  }
};

const activeDirectoryLogin = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const authService = new AuthService();
  try {
    const data = await authService.activeDirectoryLogin(req.body.accessToken);
    return res.status(HttpStatus.OK).send(data);
  } catch (err) {
    return next(err);
  }
};

const getUserNameAndIdByTrustId = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const authService = new AuthService();
  try {
    const data = await authService.getUserNameAndIdByTrustId(
      req.params.trustId
    );
    return res.status(HttpStatus.OK).send({ data });
  } catch (err) {
    return next(err);
  }
};

const contactSupportForOrganisationCreation = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const authService = new AuthService();
  try {
    await authService.requestToCreateOrganisation(req.body);
    return res
      .status(HttpStatus.OK)
      .send({ message: "Request sent successfully" });
  } catch (err) {
    return next(err);
  }
};

const forgotPasswordResendOTP = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const authService = new AuthService();
  try {
    await authService.forgotPasswordResendOTP(req.params.id);
    return res.status(HttpStatus.OK).send({ message: "OTP sent successfully" });
  } catch (err) {
    return next(err);
  }
};

const logout = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const authService = new AuthService();
  try {
    await authService.logout(req.userid);
    return res
      .status(HttpStatus.OK)
      .send({ message: "Logged out successfully" });
  } catch (err) {
    return next(err);
  }
};

export default {
  signIn,
  signUpWithNewTrust,
  signupWithExistingTrust,
  twoFactorAuthentication,
  createOrChangePassword,
  getUsersByTrustId,
  manageTrustRequest,
  manageUserRequest,
  manageUsers,
  updateProfile,
  forgotPassword,
  verifyTwoStepAuthentication,
  verifyTrustTwoStepAuthentication,
  resendOTP,
  getUserById,
  setPassword,
  verifyInvitedAccount,
  resendOTPByID,
  verifyOTPById,
  changeRole,
  manageTwoFactorAuthentication,
  activeDirectoryLogin,
  getUserNameAndIdByTrustId,
  contactSupportForOrganisationCreation,
  forgotPasswordResendOTP,
  logout,
};
