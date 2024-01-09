import { Pagination } from './common';

interface CreateAuditLog {
    log: string;
    type: string;
    userid: string;
}

interface GetAuditLogs extends Pagination {
    fromDate: Date | null;
    toDate: Date | null;
}

interface GetAllAuditLogs extends Pagination {
    fromDate?: Date | null
    toDate?: Date | null
    organisationId?: string
}

export {
    CreateAuditLog,
    GetAuditLogs,
    GetAllAuditLogs
};
