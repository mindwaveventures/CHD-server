import { Optional } from 'sequelize';
import { TrustAttributes } from './trust';

interface UserAttributes {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    accessToken: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
    trustId: string;
    authEmail: boolean;
    authSMS: boolean;
    usertype: string;
    status: string;
    otp: string;
    otpExpiryDate: Date;
    salt: string;
    trust?: TrustAttributes;
    reason?: string;
    mobileNo?: string;
    passwordAttempt?: number;
    passwordAttemptExpired?: Date;
}

type UserOptionalAttributes = 'id'
    | 'lastName'
    | 'password'
    | 'accessToken'
    | 'trustId'
    | 'authEmail'
    | 'authSMS'
    | 'status'
    | 'otp'
    | 'otpExpiryDate'
    | 'createdAt'
    | 'updatedAt'
    | 'usertype'
    | 'salt'
    | 'trust'
    | 'reason'
    | 'mobileNo'
    | 'passwordAttempt'
    | 'passwordAttemptExpired';

type UserCreationAttributes = Optional<UserAttributes, UserOptionalAttributes>;

export {
    UserCreationAttributes,
    UserAttributes
};
