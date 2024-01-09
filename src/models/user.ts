import { DataTypes, ModelDefined } from 'sequelize';

// Model types
import sequelize from '../db';
import DBAttributes from '../types/db-attributes';

import Trust from './trust';

// Constant Variables
import { userStatus, usertypes } from '../constants';

const User: ModelDefined<
    DBAttributes.UserAttributes,
    DBAttributes.UserCreationAttributes
> = sequelize.define('users', {
    id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    firstName: {
        type: DataTypes.STRING,
        field: 'first_name'
    },
    lastName: {
        type: DataTypes.STRING,
        defaultValue: '',
        field: 'last_name'
    },
    trustId: {
        type: DataTypes.UUID,
        field: 'trust_id'
    },
    email: {
        type: DataTypes.STRING,
        field: 'email',
        unique: true,
        allowNull: false
    },
    mobileNo: {
        type: DataTypes.STRING,
        field: 'mobile_no',
        defaultValue: ''
    },
    accessToken: {
        type: DataTypes.STRING(1024),
        field: 'access_token'
    },
    reason: {
        type: DataTypes.STRING(1024),
        defaultValue: ''
    },
    password: {
        type: DataTypes.STRING
    },
    salt: {
        type: DataTypes.STRING
    },
    authEmail: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        field: 'auth_email'
    },
    authSMS: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        field: 'auth_sms'
    },
    usertype: {
        type: DataTypes.STRING,
        defaultValue: usertypes.clinician
    },
    status: {
        type: DataTypes.STRING,
        defaultValue: userStatus.requested
    },
    otp: {
        type: DataTypes.STRING,
        defaultValue: ''
    },
    otpExpiryDate: {
        type: DataTypes.DATE,
        defaultValue: null,
        field: 'otp_expiry_date'
    },
    termsAndConditions: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        field: 'terms_and_conditions'
    },
    passwordAttempt: {
        type: DataTypes.INTEGER,
        defaultValue: 3,
        field: 'password_attempt'
    },
    passwordAttemptExpired: {
        type: DataTypes.DATE,
        defaultValue: new Date(),
        field: 'password_attempt_expired'
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
        field: 'created_at'
    },
    updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
        field: 'updated_at'
    }
}, {
    tableName: 'users',
    timestamps: true
});

User.belongsTo(Trust, {
    foreignKey: "trustId",
    as: "trust"
});

export default User;
