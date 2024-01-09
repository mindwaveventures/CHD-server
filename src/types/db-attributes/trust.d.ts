import { Optional } from 'sequelize';

interface TrustAttributes {
    id: string;
    name: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
    reason: string;
    storageAccountName: string;
    storageAccountExpiryDate: Date;
}

type TrustOptionalAttributes = 'status'
    | 'createdAt'
    | 'updatedAt'
    | 'id'
    | 'reason'
    | 'storageAccountName'
    | 'storageAccountExpiryDate';

type TrustCreationAttributes = Optional<TrustAttributes, TrustOptionalAttributes>;

export {
    TrustAttributes,
    TrustCreationAttributes
};
