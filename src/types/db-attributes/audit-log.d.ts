import { Optional } from 'sequelize';

import { UserAttributes } from './users';

interface AuditLogAttributes {
    id: string;
    log: string;
    type: string;
    userid: string;
    createdAt: Date;
    updatedAt: Date;
    user?: UserAttributes
}

type AuditLogOptionalAttributes = 'id'
    | 'createdAt'
    | 'updatedAt'
    | 'user';

type AuditLogCreationAttributes = Optional<AuditLogAttributes, AuditLogOptionalAttributes>;

export {
    AuditLogAttributes,
    AuditLogCreationAttributes
};
