import crypto from "crypto";
import RequestType from "../types/request";
import TrustManager from "../managers/trust";
import UserManager from "../managers/users";
import {
  nodemailerManager,
  ErrorCodes,
  CustomError,
  passwordHasher,
} from "../helpers";
import {
  accountCreated,
  organisationRequestAccepeted,
  organisationRequestRejected,
  organisationArchived,
  organisationUnArchieved,
} from "../templates/email-content";
import { azureService } from "../middleware";
import {
  trustStatus,
  userStatus,
  usertypes,
  queues,
  initialOrganisationDetails,
  storageAccountCreationTime,
} from "../constants";
import appConfig from "../app-config";

const {
  invalidUser,
  invalidTrust,
  storageAccountCreationInprogress,
  storageAccountExist,
} = ErrorCodes;

class TrustService {
  trustManager: TrustManager;
  userManager: UserManager;
  constructor() {
    this.trustManager = new TrustManager();
    this.userManager = new UserManager();
  }

  _listenForNewMessage(id: string) {
    let interval: any = null;
    try {
      interval = setInterval(async () => {
        const receivedData: any = await azureService.receiveMessageByQueue();
        if (receivedData && receivedData.receivedMessageItems.length > 0) {
          for (let i = 0; i < receivedData.receivedMessageItems.length; i++) {
            const data = receivedData.receivedMessageItems[i];
            const receivedJson = Buffer.from(
              data.messageText,
              "base64"
            ).toString("utf8");
            const receivedJsonAsObject = JSON.parse(receivedJson);
            if (receivedJsonAsObject.guid === id) {
              await this.trustManager.updateTrustById(id, {
                storageAccountName: receivedJsonAsObject.storageAccountName,
              });
              await azureService.deleteMessageOnQueue(
                queues.result,
                data.messageId,
                data.popReceipt
              );
              clearInterval(interval);
              return;
            }
          }
        }
      }, 30000); // every 30 seconds
      setTimeout(() => {
        clearInterval(interval);
      }, 18000000); // After 5 hours
    } catch (err) {
      console.log(err);
      if (interval) clearInterval(interval);
      throw err;
    }
  }

  async createInitialTrustAndAdmin() {
    try {
      const { organisationName, adminEmail } = initialOrganisationDetails;
      const userExist = await this.userManager.getUserByEmail(adminEmail);
      if (userExist) {
        return "User Exist";
      }
      const { hash, salt } = passwordHasher.hashPassword("Test@123");
      const trust = await this.trustManager.createTrust({
        name: organisationName,
        status: trustStatus.active,
        email: "test@mailinator.com", // both email and firstname is dummy
        firstName: "test",
        storageAccountExpiryDate: new Date(
          new Date().setMinutes(
            new Date().getMinutes() + storageAccountCreationTime
          )
        ),
      });
      await this.userManager.createUser({
        firstName: "Admin",
        password: hash,
        salt,
        email: adminEmail,
        trustId: trust.getDataValue("id"),
        status: userStatus.active,
        termsAndConditions: true,
        usertype: usertypes.admin,
      });
      await azureService.sendMessageToQueue(
        {
          guid: trust.getDataValue("id"),
          name: trust.getDataValue("name"),
        },
        queues.request
      );
      return this._listenForNewMessage(trust.getDataValue("id"));
    } catch (err) {
      return err;
    }
  }

  async createTrustAndAdmin(data: RequestType.CreateTrust) {
    try {
      const user = await this.userManager.getUserByEmail(data.email);
      if (user) {
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
      data.storageAccountExpiryDate = new Date(
        new Date().setMinutes(
          new Date().getMinutes() + storageAccountCreationTime
        )
      );
      const trust = await this.trustManager.createTrust(data);
      const resetToken = crypto.randomBytes(32).toString("hex");
      const newUser = await this.userManager.createUser({
        ...data,
        trustId: trust.getDataValue("id"),
        status: userStatus.active,
        termsAndConditions: true,
        usertype: usertypes.admin,
        password: resetToken,
      });
      await azureService.sendMessageToQueue(
        {
          guid: trust.getDataValue("id"),
          name: trust.getDataValue("name"),
        },
        queues.request
      );
      this._listenForNewMessage(trust.getDataValue("id"));
      return nodemailerManager({
        to: data.email,
        html: accountCreated({
          name: data.firstName + " " + (data.lastName || ""),
          url: `${
            appConfig.appURL
          }/setup-account/${resetToken}/${newUser.getDataValue("id")}`,
        }),
        subject: "WNB Account Created",
      });
    } catch (err) {
      throw err;
    }
  }

  async editTrust({ name, id, status, reason }: RequestType.EditTrust) {
    try {
      const trustExist = await this.trustManager.getTrustById(id);
      if (!trustExist) {
        throw new CustomError(
          invalidTrust.message,
          invalidTrust.errorCode,
          invalidTrust.statusCode
        );
      }
      const { rows } = await this.userManager.getUserByTrustId({
        trustId: trustExist.getDataValue("id"),
        usertype: usertypes.admin,
      });
      const admin = rows[0];
      if (
        status &&
        trustExist.getDataValue("status") === trustStatus.archived &&
        status !== trustStatus.archived
      ) {
        nodemailerManager({
          to: rows.map((item) => item.getDataValue("email")),
          html: organisationUnArchieved(trustExist.getDataValue("name")),
          subject: "WNB Account Unarchived",
        });
      }
      if (status && status === trustStatus.archived) {
        await this.userManager.removeUserAccessByTrust(
          trustExist.getDataValue("id")
        );
        nodemailerManager({
          to: rows.map((item) => item.getDataValue("email")),
          html: organisationArchived(trustExist.getDataValue("name")),
          subject: "WNB Account Archived",
        });
      }
      // if (status && status === trustStatus.rejected) {
      //   nodemailerManager({
      //     to: admin.getDataValue("email"),
      //     html: organisationRequestRejected({
      //       name:
      //         admin.getDataValue("firstName") +
      //         " " +
      //         admin.getDataValue("lastName"),
      //       reason: reason || "",
      //       trustName: trustExist.getDataValue("name"),
      //     }),
      //     subject: "WNB Account Rejected",
      //   });
      // }
      if (status && status === trustStatus.active) {
        await this.userManager.updateUserById(admin.getDataValue("id"), {
          status: userStatus.active,
        });
        // await azureService.sendMessageToQueue(
        //   {
        //     guid: trustExist.getDataValue("id"),
        //     name: trustExist.getDataValue("name"),
        //   },
        //   queues.request
        // );
        // this._listenForNewMessage(trustExist.getDataValue("id"));
        // nodemailerManager({
        //   to: admin.getDataValue("email"),
        //   html: organisationRequestAccepeted({
        //     name:
        //       admin.getDataValue("firstName") +
        //       " " +
        //       admin.getDataValue("lastName"),
        //     url: `${appConfig.appURL}/login`,
        //     trustName: trustExist.getDataValue("name"),
        //   }),
        //   subject: "WNB Account Created",
        // });
      }
      return await this.trustManager.updateTrustById(id, {
        name,
        status,
        reason,
      });
    } catch (err) {
      throw err;
    }
  }

  async getAllTrustByStatus(data: RequestType.TurstByStatus) {
    try {
      const { rows, count } = await this.trustManager.getAllTrustByStatus(data);
      const users = await this.userManager.getUserByTrustIds(
        rows.map((item) => item.getDataValue("id"))
      );
      const value = rows.map((item) => {
        const trustUsers = users.filter(
          (element) =>
            element.getDataValue("trustId") === item.getDataValue("id")
        );
        const resendInvite =
          trustUsers.length === 1 && !trustUsers[0].getDataValue("salt");
        const expiryDate = new Date(
          item.getDataValue("storageAccountExpiryDate")
        );
        const expired = expiryDate.getTime() > new Date().getTime();
        return {
          id: item.getDataValue("id"),
          name: item.getDataValue("name"),
          reason: item.getDataValue("reason"),
          email: trustUsers.map((element) => element.getDataValue("email")),
          accountStatus: item.getDataValue("storageAccountName")
            ? "Created"
            : expired
            ? "Inprogress"
            : "Failed",
          resendInvite,
          createdAt: item.getDataValue('createdAt')
        };
      });
      return {
        rows: value,
        count,
      };
    } catch (err) {
      throw err;
    }
  }

  async resendInviteToTrust(email: string) {
    try {
      const user = await this.userManager.getUserByEmail(email);
      return nodemailerManager({
        to: user?.getDataValue("email") || "",
        html: accountCreated({
          name:
            user?.getDataValue("firstName") +
            " " +
            user?.getDataValue("lastName"),
          url: `${appConfig.appURL}/setup-account/${user?.getDataValue(
            "password"
          )}/${user?.getDataValue("id")}`,
        }),
        subject: "WNB Account Created",
      });
    } catch (err) {
      throw err;
    }
  }

  getTrustNameAndId(name: string) {
    return this.trustManager.getAllTrustByStatus({
      status: trustStatus.active,
      attributes: ["name", "id"],
      searchText: name,
    });
  }

  async recreateAzureStorageAccountIfNotExist(id: string) {
    try {
      const trustExist = await this.trustManager.getTrustById(id);
      if (!trustExist)
        throw new CustomError(
          invalidTrust.message,
          invalidTrust.errorCode,
          invalidTrust.statusCode
        );

      if (trustExist.getDataValue("storageAccountName"))
        throw new CustomError(
          storageAccountExist.message,
          storageAccountExist.errorCode,
          storageAccountExist.statusCode
        );

      const expiryDate = new Date(
        trustExist.getDataValue("storageAccountExpiryDate")
      );
      if (expiryDate.getTime() > new Date().getTime())
        throw new CustomError(
          storageAccountCreationInprogress.message,
          storageAccountCreationInprogress.errorCode,
          storageAccountCreationInprogress.statusCode
        );

      await azureService.sendMessageToQueue(
        {
          guid: trustExist.getDataValue("id"),
          name: trustExist.getDataValue("name"),
        },
        queues.request
      );

      await this.trustManager.updateTrustById(trustExist.getDataValue("id"), {
        storageAccountExpiryDate: new Date(
          new Date().setMinutes(
            new Date().getMinutes() + storageAccountCreationTime
          )
        ),
      });

      return this._listenForNewMessage(trustExist.getDataValue("id"));
    } catch (err) {
      throw err;
    }
  }
}

export default TrustService;
