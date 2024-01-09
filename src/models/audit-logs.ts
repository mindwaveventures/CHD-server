import { DataTypes, ModelDefined } from 'sequelize';

import Users from './user';

// Model types
import sequelize from '../db';
import DBAttributes from '../types/db-attributes';

const AuditLogs: ModelDefined<
    DBAttributes.AuditLogAttributes,
    DBAttributes.AuditLogCreationAttributes
> = sequelize.define('audit_logs', {
    id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    log: {
        type: DataTypes.STRING,
        allowNull: false
    },
    type: {
        type: DataTypes.STRING,
        allowNull: false
    },
    userid: {
        type: DataTypes.UUID,
        allowNull: false
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
    tableName: 'audit_logs',
    timestamps: true
});

AuditLogs.belongsTo(Users, {
    foreignKey: 'userid',
    as: 'user'
});

export default AuditLogs;
