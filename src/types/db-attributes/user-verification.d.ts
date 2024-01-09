import { Optional } from "sequelize";
import { UserAttributes } from "./users";

interface UserVerificationAttributes {
  id: string;
  userId: string;
  type: string;
  otp: string;
  otpExpiry: Date;
  token: string;
  createdAt: Date;
  updatedAt: Date;
  user: UserAttributes;
}

type UserVerificationOptionalAttributes =
  | "token"
  | "otpExpiry"
  | "otp"
  | "createdAt"
  | "updatedAt"
  | "id"
  | "user";

type UserVerificationCreationAttributes = Optional<
  UserVerificationAttributes,
  UserVerificationOptionalAttributes
>;

export { UserVerificationAttributes, UserVerificationCreationAttributes };
