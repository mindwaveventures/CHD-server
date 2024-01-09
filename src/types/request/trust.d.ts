import { Pagination } from './common';

interface TurstByStatus extends Pagination {
    status: string,
    attributes: string[]
};

interface UserByTrustId extends Pagination {
    trustId: string
    status?: string;
    usertype?: string;
};

interface CreateTrust {
    name: string;
    firstName: string;
    lastName?: string;
    email: string;
    status?: string;
    storageAccountExpiryDate?: Date
};

interface EditTrust {
    name?: string;
    id: string;
    reason?: string;
    status?: string;
};

interface UpdateTrust {
    name?: string;
    status?: string;
    reason?: string;
    storageAccountName?: string;
    storageAccountExpiryDate?: Date
};

export {
    CreateTrust,
    EditTrust,
    UserByTrustId,
    UpdateTrust,
    TurstByStatus
};
