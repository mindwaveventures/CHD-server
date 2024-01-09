import JSONWebToken from "jsonwebtoken";
import jwtDecode from "jwt-decode";

import appConfig from "../app-config";
import UserManager from "../managers/users";
import TrustManager from "../managers/trust";
import {
  CustomError,
  passwordHasher,
  Utilities,
  nodemailerManager,
  ErrorCodes,
  messageBirdManager,
} from "../helpers";
import * as RequestType from "../types/request";
import { CreateOrganisationRequest } from "../types/templates";
import {
  userStatus,
  usertypes,
  trustStatus,
  initialOrganisationDetails,
  otpVerificationType,
} from "../constants";
import {
  twoStepAuthenticationContent,
  accountCreationRequested,
  accountAccepeted,
  accountRejected,
  userCreationRequest,
  userAccepted,
  userRejected,
  userDepromoted,
  userPromoted,
  requestForCreatingOrganisation,
  forgotPasswordResendOTP,
} from "../templates/email-content";
import { OTPSMSContent } from "../templates/sms-content";
import UserVerificationManager from "../managers/user-verification";

const {
  invalidUser,
  invalidUsernameOrPassword,
  passwordNotMatch,
  invalidTrust,
  trustNotFound,
  trustNotApproved,
  userNotApproved,
  userNotFound,
  invalidOTP,
  minAdminRequired,
  passwordAttemptFailed,
  expiredOTP,
  invalidOTPType,
  invalidRole,
} = ErrorCodes;

interface InvalidLoginAttempt {
  id: string;
  passwordAttempt?: number;
  passwordAttemptExpired?: Date;
  otpExpiry?: Date;
  password: string;
  salt: string;
  otp?: string;
  currentPassword?: string;
  currentOTP?: string;
}

class AuthService {
  userManager: UserManager;
  trustManager: TrustManager;
  userVerificationManger: UserVerificationManager;
  constructor() {
    this.userManager = new UserManager();
    this.trustManager = new TrustManager();
    this.userVerificationManger = new UserVerificationManager();
  }

  _generateTokens(payload: RequestType.TokenPayload) {
    const {
      jwtAccessTokenSecretKey,
      jwtAccessTokenExpiresIn,
      jwtTokenAlgorithm,
      jwtRefershTokenSecretKey,
      jwtRefreshTokenExpiresIn,
    } = appConfig;
    const accessTokenOptions: any = {
      algorithm: jwtTokenAlgorithm,
      expiresIn: jwtAccessTokenExpiresIn,
    };
    const refereshTokenOptions: any = {
      algorithm: jwtTokenAlgorithm,
      expiresIn: jwtRefreshTokenExpiresIn,
    };

    const accessToken = JSONWebToken.sign(
      payload,
      jwtAccessTokenSecretKey,
      accessTokenOptions
    );
    const refreshToken = JSONWebToken.sign(
      payload,
      jwtRefershTokenSecretKey,
      refereshTokenOptions
    );

    return { accessToken, refreshToken };
  }

  _addMinuteToCurrentDate(minutes: number): Date {
    const currentDate = new Date();
    return new Date(currentDate.getTime() + minutes * 60000);
  }

  async _invalidLoginAttempt(id: string, passwordAttempt: number) {
    try {
      if (passwordAttempt === 1) {
        await this.userManager.updateUserById(id, {
          passwordAttempt: 0,
          passwordAttemptExpired: new Date(
            new Date().setMinutes(new Date().getMinutes() + 10)
          ),
        });
      } else {
        await this.userManager.updateUserById(id, {
          passwordAttempt: passwordAttempt - 1,
        });
      }
    } catch(error) {
      throw error;
    }
  }

  async _checkLoginAttempt({
    id,
    passwordAttempt = 0,
    passwordAttemptExpired = undefined,
    otpExpiry = undefined,
    currentPassword = '',
    password,
    salt,
    currentOTP,
    otp
  }: InvalidLoginAttempt) {
    try {
      if (
        new Date().getTime() <
        new Date(passwordAttemptExpired || "").getTime()
      ) {
        throw new CustomError(
          passwordAttemptFailed.message,
          passwordAttemptFailed.errorCode,
          passwordAttemptFailed.statusCode
        );
      }
      const userVerification =
        await this.userVerificationManger.getLatestUserVerification(
          otpVerificationType.loginVerification,
          id
        );

      if (currentPassword) {
        const validatePassword = passwordHasher.validate(
          currentPassword,
          password,
          salt
        );
        
        if (!validatePassword) {
          await this._invalidLoginAttempt(id, passwordAttempt);

          throw new CustomError(
            invalidUsernameOrPassword.message,
            invalidUsernameOrPassword.errorCode,
            invalidUsernameOrPassword.statusCode
          );
        }
      }

      if (
        currentOTP &&
        currentOTP !== otp
      ) {
        if (userVerification && otpExpiry) {
          if (new Date(otpExpiry).getTime() < new Date().getTime()) {
            throw new CustomError(
              expiredOTP.message,
              expiredOTP.errorCode,
              expiredOTP.statusCode
            );
          }
        }

        await this._invalidLoginAttempt(id, passwordAttempt);

        throw new CustomError(
          invalidOTP.message,
          invalidOTP.errorCode,
          invalidOTP.statusCode
        );
      }

      await this.userManager.updateUserById(id, {
        passwordAttempt: 3,
      });
    } catch (error) {
      throw error;
    }
  }

  async signIn({ id, otp }: RequestType.Signin) {
    try {
      const user = await this.userManager.getUserById(id);
      if (!user) {
        throw new CustomError(
          invalidUsernameOrPassword.message,
          invalidUsernameOrPassword.errorCode,
          invalidUsernameOrPassword.statusCode
        );
      }
      if (userStatus.active !== user.getDataValue("status")) {
        throw new CustomError(
          userNotApproved.message,
          userNotApproved.errorCode,
          userNotApproved.statusCode
        );
      }
      if (
        user.getDataValue("trust") &&
        trustStatus.active !== user.getDataValue("trust")?.status
      ) {
        throw new CustomError(
          trustNotApproved.message,
          trustNotApproved.errorCode,
          trustNotApproved.statusCode
        );
      }

            const userVerification =
        await this.userVerificationManger.getLatestUserVerification(
          otpVerificationType.loginVerification,
          user.getDataValue("id")
        );

      await this._checkLoginAttempt({
        id,
        passwordAttempt: user.getDataValue('passwordAttempt'),
        passwordAttemptExpired: user.getDataValue('passwordAttemptExpired'),
        otpExpiry: userVerification?.getDataValue('otpExpiry'),
        currentPassword: '',
        password: user.getDataValue('password'),
        salt: user.getDataValue('salt'),
        currentOTP: otp,
        otp: userVerification?.getDataValue('otp')
      });

      // const passwordAttempt = user.getDataValue("passwordAttempt") || 0;
      // if (passwordAttempt <= 0) {
      //   await this.userManager.updateUserById(user.getDataValue("id"), {
      //     passwordAttempt: 3,
      //   });
      // }
      // if (
      //   new Date().getTime() <
      //   new Date(user.getDataValue("passwordAttemptExpired") || "").getTime()
      // ) {
      //   throw new CustomError(
      //     passwordAttemptFailed.message,
      //     passwordAttemptFailed.errorCode,
      //     passwordAttemptFailed.statusCode
      //   );
      // }
      // const userVerification =
      //   await this.userVerificationManger.getLatestUserVerification(
      //     otpVerificationType.loginVerification,
      //     user.getDataValue("id")
      //   );
      // if (
      //   otp &&
      //   userVerification &&
      //   otp !== userVerification.getDataValue("otp")
      // ) {
      //   const otpExpiry = userVerification?.getDataValue("otpExpiry");
      //   if (new Date(otpExpiry).getTime() < new Date().getTime()) {
      //     throw new CustomError(
      //       expiredOTP.message,
      //       expiredOTP.errorCode,
      //       expiredOTP.statusCode
      //     );
      //   }
      //   if (passwordAttempt === 1) {
      //     await this.userManager.updateUserById(user.getDataValue("id"), {
      //       passwordAttempt: 0,
      //       passwordAttemptExpired: new Date(
      //         new Date().setMinutes(new Date().getMinutes() + 10)
      //       ),
      //     });
      //   } else {
      //     await this.userManager.updateUserById(user.getDataValue("id"), {
      //       passwordAttempt: passwordAttempt - 1,
      //     });
      //   }
      //   throw new CustomError(
      //     invalidOTP.message,
      //     invalidOTP.errorCode,
      //     invalidOTP.statusCode
      //   );
      // }
      const { refreshToken, accessToken } = this._generateTokens({
        id: user.getDataValue("id"),
        email: user.getDataValue("email"),
        usertype: user.getDataValue("usertype"),
        trustId: user.getDataValue("trustId") || "",
        trustName: user.getDataValue("trust")?.name || "",
      });
      await this.userManager.updateUserById(user.getDataValue("id"), {
        accessToken,
        passwordAttempt: 3,
      });
      return {
        refreshToken,
        accessToken,
        name:
          user.getDataValue("firstName") +
          " " +
          (user.getDataValue("lastName") || ""),
        email: user.getDataValue("email"),
        id: user.getDataValue("id"),
        usertype: user.getDataValue("usertype"),
        trustName: user.getDataValue("trust")?.name,
        trustId: user.getDataValue("trustId"),
      };
    } catch (err) {
      throw err;
    }
  }

  async activeDirectoryLogin(adAccessToken: string) {
    try {
      const decoded: any = jwtDecode(adAccessToken);
      const email: string = decoded.email || decoded.unique_name;
      const name: string = decoded.name;
      const commonTrust = await this.trustManager.getTrustByName(
        initialOrganisationDetails.organisationName
      );
      if (!commonTrust) {
        throw new CustomError(
          trustNotFound.message,
          trustNotFound.errorCode,
          trustNotFound.statusCode
        );
      }
      let user = await this.userManager.getUserByEmail(email);
      if (!user) {
        user = await this.userManager.createUser({
          trustId: commonTrust.getDataValue("id"),
          status: userStatus.active,
          termsAndConditions: true,
          usertype: usertypes.clinician,
          email,
          firstName: name,
        });
      }
      const { refreshToken, accessToken } = this._generateTokens({
        id: user.getDataValue("id"),
        email: user.getDataValue("email"),
        usertype: user.getDataValue("usertype"),
        trustId: user.getDataValue("trustId") || "",
        trustName: user.getDataValue("trust")?.name || "",
      });
      await this.userManager.updateUserById(user.getDataValue("id"), {
        accessToken,
      });
      return {
        refreshToken,
        accessToken,
        name:
          user.getDataValue("firstName") +
          " " +
          (user.getDataValue("lastName") || ""),
        email: user.getDataValue("email"),
        id: user.getDataValue("id"),
        usertype: user.getDataValue("usertype"),
        trustName: commonTrust.getDataValue("name"),
        trustId: user.getDataValue("trustId"),
      };
    } catch (err) {
      throw err;
    }
  }

  async twoFactorAuthentication({
    email,
    password,
  }: RequestType.TwoFactorAuthentication) {
    try {
      const user = await this.userManager.getUserByEmail(email);
      if (!user) {
        throw new CustomError(
          invalidUsernameOrPassword.message,
          invalidUsernameOrPassword.errorCode,
          invalidUsernameOrPassword.statusCode
        );
      }
      if (userStatus.active !== user.getDataValue("status")) {
        throw new CustomError(
          userNotApproved.message,
          userNotApproved.errorCode,
          userNotApproved.statusCode
        );
      }
      if (
        user.getDataValue("trust") &&
        trustStatus.active !== user.getDataValue("trust")?.status
      ) {
        throw new CustomError(
          trustNotApproved.message,
          trustNotApproved.errorCode,
          trustNotApproved.statusCode
        );
      }

      if (
        new Date().getTime() <
        new Date(user.getDataValue("passwordAttemptExpired") || "").getTime()
      ) {
        throw new CustomError(
          passwordAttemptFailed.message,
          passwordAttemptFailed.errorCode,
          passwordAttemptFailed.statusCode
        );
      }

      await this._checkLoginAttempt({
        id: user.getDataValue('id'),
        passwordAttempt: user.getDataValue('passwordAttempt'),
        passwordAttemptExpired: user.getDataValue('passwordAttemptExpired'),
        otpExpiry: user.getDataValue('otpExpiryDate'),
        currentPassword: password,
        password: user.getDataValue('password'),
        salt: user.getDataValue('salt'),
        currentOTP: '',
        otp: user.getDataValue('otp')
      });

      // const validatePassword = passwordHasher.validate(
      //   password,
      //   user.getDataValue("password"),
      //   user.getDataValue("salt")
      // );
      // if (!validatePassword) {
      //   throw new CustomError(
      //     invalidUsernameOrPassword.message,
      //     invalidUsernameOrPassword.errorCode,
      //     invalidUsernameOrPassword.statusCode
      //   );
      // }

      const otp: string = Utilities.randomString(6, "#");
      await this.userVerificationManger.createUserVerification({
        userId: user.getDataValue("id"),
        type: otpVerificationType.loginVerification,
        otp,
        otpExpiry: this._addMinuteToCurrentDate(10),
      });
      // await this.userManager.updateOTPAndExpiryDate(user.getDataValue('id'), otp, this._addMinuteToCurrentDate(10));
      if (user.getDataValue("authEmail") && user.getDataValue("authSMS")) {
        nodemailerManager({
          to: user.getDataValue("email"),
          subject: "Two Factor Authentication on WNB",
          html: twoStepAuthenticationContent({
            name:
              user.getDataValue("firstName") +
              " " +
              (user.getDataValue("lastName") || ""),
            otp,
          }),
        });
        messageBirdManager.sendSingleOrBulkMail({
          recipients: [user.getDataValue("mobileNo") || ""],
          message: OTPSMSContent(otp),
        });
      } else if (user.getDataValue("authEmail")) {
        nodemailerManager({
          to: user.getDataValue("email"),
          subject: "Two Factor Authentication on WNB",
          html: twoStepAuthenticationContent({
            name:
              user.getDataValue("firstName") +
              " " +
              (user.getDataValue("lastName") || ""),
            otp,
          }),
        });
      } else if (user.getDataValue("authSMS")) {
        messageBirdManager.sendSingleOrBulkMail({
          recipients: [user.getDataValue("mobileNo") || ""],
          message: OTPSMSContent(otp),
        });
      }
      if (user.getDataValue("authEmail") || user.getDataValue("authSMS")) {
        return {
          message: "OTP Sent Successfully",
          otp: true,
          id: user.getDataValue("id"),
        };
      }
      return await this.signIn({ id: user.getDataValue("id") });
    } catch (err) {
      throw err;
    }
  }

  async createOrChangePassword({
    id,
    newPassword,
    confirmPassword,
  }: RequestType.CreateOrChangePassword) {
    try {
      const userVerification =
        await this.userVerificationManger.getUserVerificationById(id);
      const user = userVerification?.getDataValue("user");
      if (!user) {
        throw new CustomError(
          invalidUsernameOrPassword.message,
          invalidUsernameOrPassword.errorCode,
          invalidUsernameOrPassword.statusCode
        );
      }
      if (newPassword !== confirmPassword) {
        throw new CustomError(
          passwordNotMatch.message,
          passwordNotMatch.errorCode,
          passwordNotMatch.statusCode
        );
      }
      const { salt, hash } = passwordHasher.hashPassword(confirmPassword);
      return await this.userManager.updateUserById(user.id, {
        password: hash,
        salt,
      });
    } catch (err) {
      throw err;
    }
  }

  async signUpWithNewTrust(data: RequestType.SignUpWithNewTrust) {
    try {
      const { email, otp, name } = data;
      const userExist = await this.userManager.getUserByEmail(email);
      if (otp) {
        if (!userExist) {
          throw new CustomError(
            invalidUser.message,
            invalidUser.errorCode,
            invalidUser.statusCode
          );
        }
        const trustExist = await this.trustManager.getTrustById(
          userExist.getDataValue("trustId")
        );
        if (!trustExist) {
          throw new CustomError(
            invalidTrust.message,
            invalidTrust.errorCode,
            invalidTrust.statusCode
          );
        }
        if (otp !== userExist.getDataValue("otp")) {
          throw new CustomError(
            invalidOTP.message,
            invalidOTP.errorCode,
            invalidOTP.statusCode
          );
        }
        await this.trustManager.updateTrustById(trustExist.getDataValue("id"), {
          status: trustStatus.request,
        });

        await this.userManager.updateUserById(userExist.getDataValue("id"), {
          status: userStatus.requested,
        });
      } else {
        if (userExist) {
          throw new CustomError(
            invalidUser.message,
            invalidUser.errorCode,
            invalidUser.statusCode
          );
        }
        const trustExist = await this.trustManager.getTrustByName(name);
        if (trustExist) {
          throw new CustomError(
            invalidTrust.message,
            invalidTrust.errorCode,
            invalidTrust.statusCode
          );
        }
        if (data.newPassword !== data.confirmPassword) {
          throw new CustomError(
            passwordNotMatch.message,
            passwordNotMatch.errorCode,
            passwordNotMatch.statusCode
          );
        }
        const { hash, salt } = passwordHasher.hashPassword(
          data.confirmPassword
        );
        const trust = await this.trustManager.createTrust({
          ...data,
          status: trustStatus.request,
        });
        await this.userManager.createUser({
          ...data,
          trustId: trust.getDataValue("id"),
          status: userStatus.requested,
          termsAndConditions: true,
          usertype: usertypes.admin,
          password: hash,
          salt,
        });
      }
      nodemailerManager({
        to: data.email,
        subject: "Request made successfully",
        html: accountCreationRequested({
          name: data.firstName + " " + data.lastName,
          trustName: name,
        }),
      });
      return userExist;
    } catch (err) {
      throw err;
    }
  }

  async verifyTrustTwoStepAuthentication(
    data: RequestType.VerifyTrustTwoStepVerification
  ) {
    try {
      const { authEmail, authSMS, email, firstName, lastName, phone } = data;
      const userExist = await this.userManager.getUserByEmail(data.email);
      if (userExist) {
        throw new CustomError(
          invalidUser.message,
          invalidUser.errorCode,
          invalidUser.statusCode
        );
      }
      const trustExist = await this.trustManager.getTrustByName(data.name);
      if (trustExist) {
        throw new CustomError(
          invalidTrust.message,
          invalidTrust.errorCode,
          invalidTrust.statusCode
        );
      }
      if (data.newPassword !== data.confirmPassword) {
        throw new CustomError(
          passwordNotMatch.message,
          passwordNotMatch.errorCode,
          passwordNotMatch.statusCode
        );
      }
      const trust = await this.trustManager.createTrust({
        ...data,
        status: trustStatus.pending,
      });

      const { hash, salt } = passwordHasher.hashPassword(data.confirmPassword);
      const otp: string = Utilities.randomString(6, "#");
      const user = await this.userManager.createUser({
        ...data,
        mobileNo: phone || "",
        trustId: trust.getDataValue("id"),
        status: userStatus.pending,
        termsAndConditions: true,
        usertype: usertypes.admin,
        password: hash,
        // otp,
        // otpExpiryDate: this._addMinuteToCurrentDate(10),
        salt,
        authEmail,
        authSMS,
      });
      await this.userVerificationManger.createUserVerification({
        userId: user.getDataValue("id"),
        type: otpVerificationType.trustVerification,
        otp,
        otpExpiry: this._addMinuteToCurrentDate(10),
      });
      if (authEmail && authSMS) {
        nodemailerManager({
          to: email,
          subject: "Two Factor Authentication OTP",
          html: twoStepAuthenticationContent({
            name: firstName + " " + (lastName || ""),
            otp: otp,
          }),
        });
        return messageBirdManager.sendSingleOrBulkMail({
          recipients: [data.phone || ""],
          message: OTPSMSContent(otp),
        });
      }
      if (authEmail) {
        return nodemailerManager({
          to: email,
          subject: "Two Factor Authentication OTP",
          html: twoStepAuthenticationContent({
            name: firstName + " " + (lastName || ""),
            otp: otp,
          }),
        });
      }
      if (authSMS) {
        return messageBirdManager.sendSingleOrBulkMail({
          recipients: [phone || ""],
          message: OTPSMSContent(otp),
        });
      }
    } catch (err) {
      throw err;
    }
  }

  async signupWithExistingTrust(data: RequestType.SignUpWithExistingTrust) {
    try {
      const { email, otp, newPassword, confirmPassword, trustId, OTPType } =
        data;
      const trustExist = await this.trustManager.getTrustById(trustId);
      if (!trustExist) {
        throw new CustomError(
          trustNotFound.message,
          trustNotFound.errorCode,
          trustNotFound.statusCode
        );
      }
      if (trustExist.getDataValue("status") !== trustStatus.active) {
        throw new CustomError(
          trustNotApproved.message,
          trustNotApproved.errorCode,
          trustNotApproved.statusCode
        );
      }
      const userExist = await this.userManager.getUserByEmail(email);
      if (otp) {
        if (!userExist) {
          throw new CustomError(
            invalidUser.message,
            invalidUser.errorCode,
            invalidUser.statusCode
          );
        }
        const { loginVerification, setNewAccountPassword } =
          otpVerificationType;
        if (![loginVerification, setNewAccountPassword].includes(OTPType)) {
          throw new CustomError(
            invalidOTPType.message,
            invalidOTPType.errorCode,
            invalidOTPType.statusCode
          );
        }
        const otpVerification =
          await this.userVerificationManger.getLatestUserVerification(
            OTPType,
            userExist.getDataValue("id")
          );
        if (otpVerification && otp !== otpVerification.getDataValue("otp")) {
          throw new CustomError(
            invalidOTP.message,
            invalidOTP.errorCode,
            invalidOTP.statusCode
          );
        }
        await this.userManager.updateUserById(userExist.getDataValue("id"), {
          status: userStatus.requested,
        });
      } else {
        if (userExist) {
          throw new CustomError(
            invalidUser.message,
            invalidUser.errorCode,
            invalidUser.statusCode
          );
        }
        if (newPassword !== confirmPassword) {
          throw new CustomError(
            passwordNotMatch.message,
            passwordNotMatch.errorCode,
            passwordNotMatch.statusCode
          );
        }
        const { hash, salt } = passwordHasher.hashPassword(confirmPassword);
        await this.userManager.createUser({
          ...data,
          trustId: trustExist.getDataValue("id"),
          status: userStatus.requested,
          termsAndConditions: true,
          usertype: usertypes.clinician,
          password: hash,
          salt,
        });
      }
      nodemailerManager({
        to: data.email,
        subject: "Request made successfully",
        html: userCreationRequest({
          name: data.firstName + " " + data.lastName,
          trustName: trustExist?.getDataValue("name") || "",
        }),
      });
      return userExist;
    } catch (err) {
      throw err;
    }
  }

  async verifyTwoStepAuthentication({
    trustId,
    email,
    smsAuth,
    emailAuth,
    firstName,
    lastName,
    newPassword,
    confirmPassword,
    phone,
  }: RequestType.VerifyTwoStepAuthentication) {
    try {
      const trustExist = await this.trustManager.getTrustById(trustId);
      if (!trustExist) {
        throw new CustomError(
          trustNotFound.message,
          trustNotFound.errorCode,
          trustNotFound.statusCode
        );
      }
      const userExist = await this.userManager.getUserByEmail(email);
      if (userExist) {
        throw new CustomError(
          invalidUser.message,
          invalidUser.errorCode,
          invalidUser.statusCode
        );
      }
      if (trustExist.getDataValue("status") !== trustStatus.active) {
        throw new CustomError(
          trustNotApproved.message,
          trustNotApproved.errorCode,
          trustNotApproved.statusCode
        );
      }
      if (newPassword !== confirmPassword) {
        throw new CustomError(
          passwordNotMatch.message,
          passwordNotMatch.errorCode,
          passwordNotMatch.statusCode
        );
      }
      const { hash, salt } = passwordHasher.hashPassword(confirmPassword);
      const otp: string = Utilities.randomString(6, "#");
      const user = await this.userManager.createUser({
        // mobileNo: phone || "",
        // otp,
        // otpExpiryDate: this._addMinuteToCurrentDate(10),
        email,
        trustId: trustExist.getDataValue("id"),
        firstName,
        lastName,
        status: userStatus.pending,
        termsAndConditions: true,
        usertype: usertypes.clinician,
        password: hash,
        salt,
        authEmail: emailAuth,
        authSMS: smsAuth,
      });
      await this.userVerificationManger.createUserVerification({
        userId: user.getDataValue("id"),
        type: otpVerificationType.trustVerification,
        otp,
        otpExpiry: this._addMinuteToCurrentDate(10),
      });
      if (emailAuth && smsAuth) {
        nodemailerManager({
          to: email,
          subject: "Two Factor Authentication OTP",
          html: twoStepAuthenticationContent({
            name: firstName + " " + (lastName || ""),
            otp: otp,
          }),
        });
        return messageBirdManager.sendSingleOrBulkMail({
          recipients: [phone || ""],
          message: OTPSMSContent(otp),
        });
      }
      if (emailAuth) {
        return nodemailerManager({
          to: email,
          subject: "Two Factor Authentication OTP",
          html: twoStepAuthenticationContent({
            name: firstName + " " + (lastName || ""),
            otp: otp,
          }),
        });
      }
      if (smsAuth) {
        return messageBirdManager.sendSingleOrBulkMail({
          recipients: [phone || ""],
          message: OTPSMSContent(otp),
        });
      }
    } catch (err) {
      throw err;
    }
  }

  async manageTrustRequest({
    trustId,
    status,
    reason,
  }: RequestType.ManageTrustRequest) {
    try {
      const trustExist = await this.trustManager.getTrustById(trustId);
      if (!trustExist) {
        throw new CustomError(
          trustNotFound.message,
          trustNotFound.errorCode,
          trustNotFound.statusCode
        );
      }
      const { rows } = await this.userManager.getUserByTrustId({ trustId });
      const user = rows[0];
      if (trustStatus.active === status) {
        nodemailerManager({
          to: user.getDataValue("email"),
          subject: "Request Accepted",
          html: accountAccepeted({
            name:
              user.getDataValue("firstName") +
              " " +
              (user.getDataValue("lastName") || ""),
            trustName: trustExist.getDataValue("name"),
            url: "",
          }),
        });
      }
      if (trustStatus.rejected === status) {
        nodemailerManager({
          to: user.getDataValue("email"),
          subject: "Request Rejected",
          html: accountRejected({
            name:
              user.getDataValue("firstName") +
              " " +
              (user.getDataValue("lastName") || ""),
            trustName: trustExist.getDataValue("name"),
            reason: reason || "",
          }),
        });
      }
      await this.userManager.updateUserById(user.getDataValue("id"), {
        status:
          trustStatus.active === status
            ? userStatus.active
            : userStatus.rejected,
      });
      return await this.trustManager.updateTrustById(
        trustExist.getDataValue("id"),
        {
          status,
          reason,
        }
      );
    } catch (err) {
      throw err;
    }
  }

  async manageUserRequest({
    userid,
    status,
    reason,
  }: RequestType.ManageUserRequest) {
    try {
      const userExist = await this.userManager.getUserById(userid);
      if (!userExist) {
        throw new CustomError(
          userNotFound.message,
          userNotFound.errorCode,
          userNotFound.statusCode
        );
      }
      if (trustStatus.active !== userExist.getDataValue("trust")?.status) {
        throw new CustomError(
          trustNotApproved.message,
          trustNotApproved.errorCode,
          trustNotApproved.statusCode
        );
      }
      if (userStatus.active === status) {
        nodemailerManager({
          to: userExist.getDataValue("email"),
          subject: "Request Accepted",
          html: userAccepted({
            name:
              userExist.getDataValue("firstName") +
              " " +
              (userExist.getDataValue("lastName") || ""),
            trustName: userExist.getDataValue("trust")?.name || "",
            url: "",
          }),
        });
      }
      if (userStatus.rejected === status) {
        nodemailerManager({
          to: userExist.getDataValue("email"),
          subject: "Request Rejected",
          html: userRejected({
            name:
              userExist.getDataValue("firstName") +
              " " +
              (userExist.getDataValue("lastName") || ""),
            trustName: userExist.getDataValue("trust")?.name || "",
            reason: reason || "",
          }),
        });
      }
      return await this.userManager.updateUserById(userid, {
        status,
        reason,
      });
    } catch (err) {
      throw err;
    }
  }

  manageUsers(id: string, data: RequestType.UpdateUsers) {
    return this.userManager.updateUserById(id, data);
  }

  getUsersByTrustId(data: RequestType.UserByTrustId) {
    return this.userManager.getUserByTrustId(data);
  }

  async updateProfile(id: string, data: RequestType.UpdateUsers) {
    try {
      // const user: any = await this.userManager.getUserById(id);
      // if (!user) {
      //   throw new CustomError(
      //     invalidUser.message,
      //     invalidUser.errorCode,
      //     invalidUser.statusCode
      //   );
      // }
      // if (!data.otp && data.email && user?.getDataValue('email') !== data.email) {
      //     const otp: string = Utilities.randomString(6, '#');
      //     await this.userManager.updateOTPAndExpiryDate(user?.getDataValue('id') || '', otp, this._addMinuteToCurrentDate(10));
      //     if (user?.getDataValue('email'))
      //         nodemailerManager({
      //             to: user?.getDataValue('email'),
      //             subject: 'Verify OTP',
      //             html: twoStepAuthenticationContent({
      //                 name: user?.getDataValue('firstName') + ' ' + (user?.getDataValue('lastName') || ''),
      //                 otp
      //             })
      //         });
      //     return {
      //         message: 'OTP Sent Successfully'
      //     };
      // }
      // let otpValid = null;
      // if (data.otp) {
      //     otpValid = await this.userManager.verifyOTP(user?.getDataValue('id'), data.otp);
      //     if (!otpValid)
      //         throw new CustomError(invalidOTP.message, invalidOTP.errorCode, invalidOTP.statusCode);

      // }
      const updatedRecord = await this.userManager.updateUserById(id, {
        firstName: data.firstName,
        lastName: data.lastName,
        // email: data.email,
        mobileNo: data.mobileNo,
      });
      const responseData = updatedRecord[1][0];
      return {
        message: "Profile Updated Successfully",
        name:
          responseData.getDataValue("firstName") +
          " " +
          responseData.getDataValue("lastName"),
      };
    } catch (err) {
      throw err;
    }
  }

  async forgotPassword(email: string) {
    try {
      const user = await this.userManager.getUserByEmail(email);
      if (!user)
        throw new CustomError(
          invalidUsernameOrPassword.message,
          invalidUsernameOrPassword.errorCode,
          invalidUsernameOrPassword.statusCode
        );
      const otp: string = Utilities.randomString(6, "#");
      //   await this.userManager.updateOTPAndExpiryDate(
      //     user?.getDataValue("id") || "",
      //     otp,
      //     this._addMinuteToCurrentDate(10)
      //   );
      await this.userVerificationManger.createUserVerification({
        userId: user.getDataValue("id"),
        type: otpVerificationType.forgotPasswordVerification,
        otp,
        otpExpiry: this._addMinuteToCurrentDate(10),
      });
      nodemailerManager({
        to: user?.getDataValue("email"),
        subject: "Verify OTP",
        html: twoStepAuthenticationContent({
          name:
            user?.getDataValue("firstName") +
            " " +
            (user?.getDataValue("lastName") || ""),
          otp,
        }),
      });
      return {
        id: user.getDataValue("id"),
      };
    } catch (err) {
      throw err;
    }
  }

  async forgotPasswordResendOTP(id: string) {
    try {
      const user = await this.userManager.getUserById(id);
      if (!user)
        throw new CustomError(
          invalidUsernameOrPassword.message,
          invalidUsernameOrPassword.errorCode,
          invalidUsernameOrPassword.statusCode
        );
      const otp: string = Utilities.randomString(6, "#");
      await this.userVerificationManger.createUserVerification({
        userId: user.getDataValue("id"),
        type: otpVerificationType.forgotPasswordVerification,
        otp,
        otpExpiry: this._addMinuteToCurrentDate(10),
      });
      //   await this.userManager.updateOTPAndExpiryDate(
      //     id,
      //     otp,
      //     this._addMinuteToCurrentDate(10)
      //   );
      return nodemailerManager({
        to: user?.getDataValue("email"),
        subject: "Verify OTP",
        html: forgotPasswordResendOTP(
          user?.getDataValue("firstName") +
            " " +
            (user?.getDataValue("lastName") || ""),
          otp
        ),
      });
    } catch (err) {
      throw err;
    }
  }

  async resendOTP({
    email,
    authEmail,
    authSMS,
    OTPType,
  }: RequestType.ResendOTP) {
    try {
      const user = await this.userManager.getUserByEmail(email);
      if (!user)
        throw new CustomError(
          invalidUsernameOrPassword.message,
          invalidUsernameOrPassword.errorCode,
          invalidUsernameOrPassword.statusCode
        );
      const { loginVerification, setNewAccountPassword } = otpVerificationType;
      if (![loginVerification, setNewAccountPassword].includes(OTPType)) {
        throw new CustomError(
          invalidOTPType.message,
          invalidOTPType.errorCode,
          invalidOTPType.statusCode
        );
      }
      const otp: string = Utilities.randomString(6, "#");
      await this.userVerificationManger.createUserVerification({
        userId: user.getDataValue("id"),
        type: OTPType,
        otp,
        otpExpiry: this._addMinuteToCurrentDate(10),
      });
      //   await this.userManager.updateOTPAndExpiryDate(
      //     user.getDataValue("id"),
      //     otp,
      //     this._addMinuteToCurrentDate(10)
      //   );
      const name =
        user.getDataValue("firstName") + " " + user.getDataValue("lastName");
      if (authEmail && authSMS) {
        nodemailerManager({
          to: email,
          subject: "Two Factor Authentication OTP",
          html: twoStepAuthenticationContent({
            name,
            otp,
          }),
        });
        return messageBirdManager.sendSingleOrBulkMail({
          recipients: [user.getDataValue("mobileNo") || ""],
          message: OTPSMSContent(otp),
        });
      }
      if (authEmail) {
        return nodemailerManager({
          to: email,
          subject: "Two Factor Authentication OTP",
          html: twoStepAuthenticationContent({
            name,
            otp,
          }),
        });
      }
      if (authSMS) {
        return messageBirdManager.sendSingleOrBulkMail({
          recipients: [user.getDataValue("mobileNo") || ""],
          message: OTPSMSContent(otp),
        });
      }
    } catch (err) {
      throw err;
    }
  }

  async getUserById(id: string, code?: string) {
    try {
      const data = await this.userManager.getUserById(id);
      return {
        id: data?.getDataValue("id"),
        email: data?.getDataValue("email"),
        firstName: data?.getDataValue("firstName"),
        lastName: data?.getDataValue("lastName"),
        mobileNo: data?.getDataValue("mobileNo"),
        passwordExist: code ? code !== data?.getDataValue("password") : "",
        authEmail: data?.getDataValue("authEmail"),
        authSMS: data?.getDataValue("authSMS"),
      };
    } catch (err) {
      throw err;
    }
  }

  async setPassword({
    id,
    newPassword,
    confirmPassword,
    mobileNo,
    authEmail,
    authSMS,
  }: RequestType.SetPassword) {
    try {
      const user = await this.userManager.getUserById(id);
      if (!user)
        throw new CustomError(
          invalidUsernameOrPassword.message,
          invalidUsernameOrPassword.errorCode,
          invalidUsernameOrPassword.statusCode
        );
      if (newPassword !== confirmPassword) {
        throw new CustomError(
          passwordNotMatch.message,
          passwordNotMatch.errorCode,
          passwordNotMatch.statusCode
        );
      }
      const otp: string = Utilities.randomString(6, "#");
      const { hash, salt } = passwordHasher.hashPassword(confirmPassword);
      await this.userManager.updateUserById(id, {
        password: hash,
        salt,
        mobileNo,
        authEmail,
        authSMS,
        // otp,
        // otpExpiryDate: this._addMinuteToCurrentDate(10),
      });
      await this.userVerificationManger.createUserVerification({
        userId: user.getDataValue("id"),
        type: otpVerificationType.setNewAccountPassword,
        otp,
        otpExpiry: this._addMinuteToCurrentDate(10),
      });
      if (authEmail && authSMS) {
        nodemailerManager({
          to: user.getDataValue("email"),
          subject: "Two Factor Authentication OTP",
          html: twoStepAuthenticationContent({
            name:
              user.getDataValue("firstName") +
              " " +
              user.getDataValue("lastName"),
            otp,
          }),
        });
        return messageBirdManager.sendSingleOrBulkMail({
          recipients: [user.getDataValue("mobileNo") || ""],
          message: OTPSMSContent(otp),
        });
      }
      if (authEmail) {
        return nodemailerManager({
          to: user.getDataValue("email"),
          subject: "Two Factor Authentication OTP",
          html: twoStepAuthenticationContent({
            name:
              user.getDataValue("firstName") +
              " " +
              user.getDataValue("lastName"),
            otp,
          }),
        });
      }
      if (authSMS) {
        return messageBirdManager.sendSingleOrBulkMail({
          recipients: [user.getDataValue("mobileNo") || ""],
          message: OTPSMSContent(otp),
        });
      }
    } catch (err) {
      throw err;
    }
  }

  async verifyInvitedAccount({
    id,
    otp,
    newPassword,
    confirmPassword,
  }: RequestType.VerifyTwoStepAuthenticationSignin) {
    try {
      const user = await this.userManager.getUserById(id);
      if (!user)
        throw new CustomError(
          invalidUsernameOrPassword.message,
          invalidUsernameOrPassword.errorCode,
          invalidUsernameOrPassword.statusCode
        );
      if (otp) {
        const otpVerification =
          await this.userVerificationManger.getLatestUserVerification(
            otpVerificationType.setNewAccountPassword,
            id
          );
        if (otpVerification && otp !== otpVerification.getDataValue("otp")) {
          throw new CustomError(
            invalidOTP.message,
            invalidOTP.errorCode,
            invalidOTP.statusCode
          );
        }
        const otpExpiry = otpVerification?.getDataValue("otpExpiry");
        if (otpExpiry && new Date(otpExpiry).getTime() < new Date().getTime()) {
          throw new CustomError(
            expiredOTP.message,
            expiredOTP.errorCode,
            expiredOTP.statusCode
          );
        }
      } else {
        if (newPassword !== confirmPassword) {
          throw new CustomError(
            passwordNotMatch.message,
            passwordNotMatch.errorCode,
            passwordNotMatch.statusCode
          );
        }
        const { hash, salt } = passwordHasher.hashPassword(confirmPassword);
        await this.userManager.updateUserById(id, {
          password: hash,
          salt,
          //   otp,
          //   otpExpiryDate: this._addMinuteToCurrentDate(10),
        });
        await this.userVerificationManger.createUserVerification({
          userId: user.getDataValue("id"),
          type: otpVerificationType.setNewAccountPassword,
          otp,
          otpExpiry: this._addMinuteToCurrentDate(10),
        });
      }
      return await this.userManager.updateUserById(user.getDataValue("id"), {
        status: userStatus.active,
      });
    } catch (err) {
      throw err;
    }
  }

  async resendOTPByID(id: string, OTPType: string) {
    try {
      const user = await this.userManager.getUserById(id);
      if (!user)
        throw new CustomError(
          invalidUsernameOrPassword.message,
          invalidUsernameOrPassword.errorCode,
          invalidUsernameOrPassword.statusCode
        );
      const otp: string = Utilities.randomString(6, "#");
      //   await this.userManager.updateOTPAndExpiryDate(
      //     user.getDataValue("id"),
      //     otp,
      //     this._addMinuteToCurrentDate(10)
      //   );
      const { loginVerification, accountVerification } = otpVerificationType;
      if (![loginVerification, accountVerification].includes(OTPType)) {
        throw new CustomError(
          invalidOTPType.message,
          invalidOTPType.errorCode,
          invalidOTPType.statusCode
        );
      }
      await this.userVerificationManger.createUserVerification({
        userId: user.getDataValue("id"),
        type: OTPType,
        otp,
        otpExpiry: this._addMinuteToCurrentDate(10),
      });
      if (user.getDataValue("authEmail") && user.getDataValue("authSMS")) {
        nodemailerManager({
          to: user.getDataValue("email"),
          subject: "Two Factor Authentication on WNB",
          html: twoStepAuthenticationContent({
            name:
              user.getDataValue("firstName") +
              " " +
              (user.getDataValue("lastName") || ""),
            otp,
          }),
        });
        return messageBirdManager.sendSingleOrBulkMail({
          recipients: [user.getDataValue("mobileNo") || ""],
          message: OTPSMSContent(otp),
        });
      }
      if (user.getDataValue("authEmail")) {
        return nodemailerManager({
          to: user.getDataValue("email"),
          subject: "Two Factor Authentication on WNB",
          html: twoStepAuthenticationContent({
            name:
              user.getDataValue("firstName") +
              " " +
              (user.getDataValue("lastName") || ""),
            otp,
          }),
        });
      }
      if (user.getDataValue("authSMS")) {
        return messageBirdManager.sendSingleOrBulkMail({
          recipients: [user.getDataValue("mobileNo") || ""],
          message: OTPSMSContent(otp),
        });
      }
    } catch (err) {
      throw err;
    }
  }

  async verifyOTPById(id: string, otp: string) {
    try {
      const user = await this.userManager.getUserById(id);
      if (!user)
        throw new CustomError(
          invalidUsernameOrPassword.message,
          invalidUsernameOrPassword.errorCode,
          invalidUsernameOrPassword.statusCode
        );







      const userVerification =
        await this.userVerificationManger.getLatestUserVerification(
          otpVerificationType.forgotPasswordVerification,
          user.getDataValue("id")
        );
      if (!userVerification || otp !== userVerification.getDataValue("otp")) {
        throw new CustomError(
          invalidOTP.message,
          invalidOTP.errorCode,
          invalidOTP.statusCode
        );
      }
      const otpExpiry = userVerification?.getDataValue("otpExpiry");
      if (new Date(otpExpiry).getTime() < new Date().getTime()) {
        throw new CustomError(
          expiredOTP.message,
          expiredOTP.errorCode,
          expiredOTP.statusCode
        );
      }
      return {
        id: userVerification.getDataValue("id"),
      };
    } catch (err) {
      throw err;
    }
  }

  async changeRole({ id, name, usertype }: RequestType.ChangeRole) {
    try {
      const user = await this.userManager.getUserById(id);
      if (!user)
        throw new CustomError(
          userNotFound.message,
          userNotFound.errorCode,
          userNotFound.statusCode
        );

      const trust = await this.trustManager.getTrustByName(name);
      if (!trust)
        throw new CustomError(
          trustNotApproved.message,
          trustNotApproved.errorCode,
          trustNotApproved.statusCode
        );

      if (![usertypes.clinician, usertypes.admin].includes(usertype))
        throw new CustomError(
          invalidRole.message,
          invalidRole.errorCode,
          invalidRole.statusCode
        );

      const adminUsers = await this.userManager.getUserByStatus(
        trust.getDataValue("id"),
        usertypes.admin
      );

      if (usertype === usertypes.clinician && adminUsers.length <= 1)
        throw new CustomError(
          minAdminRequired.message,
          minAdminRequired.errorCode,
          minAdminRequired.statusCode
        );

      if (usertype === usertypes.admin) {
        nodemailerManager({
          to: user.getDataValue("email"),
          subject: "WNB Promotion",
          html: userPromoted({
            name:
              user.getDataValue("firstName") +
              " " +
              user.getDataValue("lastName"),
            trustName: user.getDataValue("trust")?.name || "",
          }),
        });
      } else if (usertype === usertypes.clinician) {
        nodemailerManager({
          to: user.getDataValue("email"),
          subject: "WNB Depromoted",
          html: userDepromoted({
            name:
              user.getDataValue("firstName") +
              " " +
              user.getDataValue("lastName"),
            trustName: user.getDataValue("trust")?.name || "",
          }),
        });
      }

      return await this.userManager.updateUserById(id, {
        usertype,
      });
    } catch (err) {
      throw err;
    }
  }

  async manageTwoFactorAuthentication(
    id: string,
    {
      email,
      mobileNo,
      authEmail,
      authSMS,
      otp,
    }: RequestType.ManageTwoFactorAuthentication
  ) {
    try {
      const user = await this.userManager.getUserById(id);
      if (!user)
        throw new CustomError(
          invalidUsernameOrPassword.message,
          invalidUsernameOrPassword.errorCode,
          invalidUsernameOrPassword.statusCode
        );
      if (otp) {
        const verificationStatus =
          await this.userVerificationManger.getLatestUserVerification(
            otpVerificationType.accountVerification,
            id
          );
        if (verificationStatus?.getDataValue("otp") !== otp)
          throw new CustomError(
            invalidOTP.message,
            invalidOTP.errorCode,
            invalidOTP.statusCode
          );
        const otpExpiry = verificationStatus.getDataValue("otpExpiry");
        if (new Date(otpExpiry).getTime() < new Date().getTime())
          throw new CustomError(
            expiredOTP.message,
            expiredOTP.errorCode,
            expiredOTP.statusCode
          );
        return await this.userManager.updateUserById(id, {
          email,
          mobileNo,
          authEmail,
          authSMS,
        });
      }
      if (
        user.getDataValue("authEmail") !== authEmail ||
        user.getDataValue("authSMS") !== authSMS
      ) {
        const newOtp: string = Utilities.randomString(6, "#");
        if (
          user.getDataValue("authEmail") !== authEmail &&
          user.getDataValue("authSMS") !== authSMS
        ) {
          nodemailerManager({
            to: user.getDataValue("email"),
            subject: "Two Factor Authentication on WNB",
            html: twoStepAuthenticationContent({
              name:
                user.getDataValue("firstName") +
                " " +
                (user.getDataValue("lastName") || ""),
              otp: newOtp,
            }),
          });
          messageBirdManager.sendSingleOrBulkMail({
            recipients: [user.getDataValue("mobileNo") || ""],
            message: OTPSMSContent(newOtp),
          });
        } else if (user.getDataValue("authEmail") !== authEmail) {
          nodemailerManager({
            to: user.getDataValue("email"),
            subject: "Two Factor Authentication on WNB",
            html: twoStepAuthenticationContent({
              name:
                user.getDataValue("firstName") +
                " " +
                (user.getDataValue("lastName") || ""),
              otp: newOtp,
            }),
          });
        } else if (user.getDataValue("authSMS") !== authSMS) {
          messageBirdManager.sendSingleOrBulkMail({
            recipients: [user.getDataValue("mobileNo") || ""],
            message: OTPSMSContent(newOtp),
          });
        }
        return await this.userVerificationManger.createUserVerification({
          userId: user.getDataValue("id"),
          type: otpVerificationType.accountVerification,
          otp: newOtp,
          otpExpiry: this._addMinuteToCurrentDate(10),
        });
      }
      return await this.userManager.updateUserById(id, { mobileNo });
    } catch (err) {
      throw err;
    }
  }

  getUserNameAndIdByTrustId(trustId: string) {
    return this.userManager.getUserNameAndIdByTrustId(trustId);
  }

  requestToCreateOrganisation(data: CreateOrganisationRequest) {
    return nodemailerManager({
      to: data.email,
      subject: "WNB organisation creation request",
      html: requestForCreatingOrganisation(data),
    });
  }

  logout(id: string) {
    return this.userManager.updateUserById(id, {
      accessToken: "",
    });
  }
}

export default AuthService;
