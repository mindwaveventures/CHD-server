import { Op } from "sequelize";
// User verification model
import { UserVerification, User } from "../models";

// Request type
import {
  UserVerificationCreation,
  UserVerificationUpdate,
} from "../types/request";

class UserVerificationManager {
  createUserVerification(data: UserVerificationCreation) {
    return UserVerification.create(data);
  }

  updateUserVerification(id: string, data: UserVerificationUpdate) {
    return UserVerification.update(data, {
      where: {
        id,
      },
    });
  }

  getLatestUserVerification(type: string, userId: string) {
    return UserVerification.findOne({
      where: {
        type,
        userId,
      },
      order: [["createdAt", "DESC"]],
    });
  }

  getUserVerificationById(id: string) {
    return UserVerification.findOne({
      where: {
        id,
      },
      include: [
        {
          model: User,
          as: "user",
        },
      ],
    });
  }
}

export default UserVerificationManager;
