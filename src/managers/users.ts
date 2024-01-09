import { Op } from "sequelize";
import { userStatus, usertypes } from "../constants";
import { User, Trust } from "../models";

// Request type
import RequestType from "../types/request";
class UserManager {
  createUser(data: RequestType.CreateUser) {
    return User.create(data);
  }

  getUserByEmail(email: string) {
    return User.findOne({
      where: {
        email: email.toLowerCase(),
      },
      include: [
        {
          model: Trust,
          as: "trust",
        },
      ],
    });
  }

  updateOTPAndExpiryDate(id: string, otp: string, expiryDate: Date) {
    return User.update(
      {
        otp,
        otpExpiryDate: expiryDate,
      },
      {
        where: {
          id,
        },
      }
    );
  }

  getUserById(id: string) {
    return User.findOne({
      where: {
        id,
      },
      include: [
        {
          model: Trust,
          as: "trust",
        },
      ],
    });
  }

  updateUserById(id: string, data: RequestType.UpdateUsers) {
    return User.update(data, {
      where: {
        id,
      },
      returning: true,
    });
  }

  getUserByTrustId(data: RequestType.UserByTrustId) {
    const query: any = {
      where: {
        trustId: data.trustId,
      },
      attributes: [
        "id",
        "firstName",
        "lastName",
        "email",
        "usertype",
        "reason",
      ],
      order: [["createdAt", "DESC"]],
    };
    if (data.status) {
      query.where.status = data.status;
    }
    if (data.usertype) {
      query.where.usertype = data.usertype;
    }
    if (data.limit && data.page) {
      query.limit = data.limit;
      query.offset = data.limit * (data.page - 1);
    }
    if (data.searchText) {
      const { searchText } = data;
      query.where = {
        trustId: data.trustId,
        [Op.or]: [
          {
            firstName: {
              [Op.iLike]: `%${searchText}%`,
            },
          },
          {
            lastName: {
              [Op.iLike]: `%${searchText}%`,
            },
          },
        ],
      };
    }
    return User.findAndCountAll(query);
  }

  verifyOTP(id: string, otp: string) {
    return User.findOne({
      where: {
        id,
        otp,
        otpExpiryDate: {
          [Op.gte]: new Date(),
        },
      },
    });
  }

  getUserByStatus(trustId: string, usertype: string) {
    return User.findAll({
      where: {
        usertype,
        trustId,
      },
    });
  }

  getUserByTrustIds(trustIds: string[]) {
    return User.findAll({
      where: {
        trustId: {
          [Op.in]: trustIds,
        },
        usertype: usertypes.admin,
      },
    });
  }

  getUserByEmailNotEqualId(userId: string, email: string) {
    return User.findOne({
      where: {
        email,
        id: {
          [Op.ne]: userId,
        },
      },
    });
  }

  getUserNameAndIdByTrustId(trustId: string) {
    return User.findAll({
      where: {
        trustId,
        status: userStatus.active,
      },
      attributes: ["firstName", "lastName", "id"],
    });
  }

  removeUserAccessByTrust(trustId: string) {
    return User.update(
      {
        accessToken: "",
      },
      {
        where: {
          trustId,
        },
      }
    );
  }
}

export default UserManager;
