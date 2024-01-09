import * as express from 'express';

import AuditLogCtrl from '../services/audit-logs';
import { HttpStatus } from '../helpers';

const getAuditLogs = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const auditLogCtrl = new AuditLogCtrl();
    try {
        const data = await auditLogCtrl.getAuditLogs(req.body, req.params.id || req.trustId);
        return res.status(HttpStatus.OK).send(data);
    } catch (err) {
        return next(err);
    }
};

const getAllAuditLogs = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const auditLogCtrl = new AuditLogCtrl();
    try {
        const data = await auditLogCtrl.getAllAuditLogs(req.body);
        return res.status(HttpStatus.OK).send(data);
    } catch (err) {
        return next(err);
    }
};

export default {
    getAuditLogs,
    getAllAuditLogs
};
