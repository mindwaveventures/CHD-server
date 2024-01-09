import { DataTypes, ModelDefined } from "sequelize";

import Users from "./user";

// Model types
import sequelize from "../db";
import DBAttributes from "../types/db-attributes";

const UserVerification: ModelDefined<
  DBAttributes.UserVerificationAttributes,
  DBAttributes.UserVerificationCreationAttributes
> = sequelize.define(
  "user_verifications",
  {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    otp: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    otpExpiry: {
      type: DataTypes.DATE,
      allowNull: true,
      field: "otp_expiry",
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: "user_id",
    },
    token: {
      type: DataTypes.STRING(1024),
      defaultValue: "",
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
      field: "created_at",
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
      field: "updated_at",
    },
  },
  {
    tableName: "user_verifications",
    timestamps: true,
  }
);

UserVerification.belongsTo(Users, {
  foreignKey: "userId",
  as: "user",
});

export default UserVerification;
