import { DataTypes, ModelDefined } from 'sequelize';

// Model types
import sequelize from '../db';
import DBAttributes from '../types/db-attributes';

// Constant Variables
import { trustStatus } from '../constants';

const Trust: ModelDefined<
    DBAttributes.TrustAttributes,
    DBAttributes.TrustCreationAttributes
> = sequelize.define('trusts', {
    id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    status: {
        type: DataTypes.STRING,
        defaultValue: trustStatus.active
    },
    reason: {
        type: DataTypes.STRING,
        defaultValue: ''
    },
    storageAccountName: {
        type: DataTypes.STRING,
        defaultValue: '',
        field: 'storage_account_name'
    },
    storageAccountExpiryDate: {
        type: DataTypes.DATE,
        defaultValue: new Date(),
        field: 'storage_expiry_date'
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
    tableName: 'trusts',
    timestamps: true
});

export default Trust;