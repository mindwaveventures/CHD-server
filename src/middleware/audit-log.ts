import * as express from 'express';
import { auditLogsValues } from '../helpers';
import AuditLogManager from '../managers/audit-logs';

export default async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const auditLogManager = new AuditLogManager();
    try {
        const splitedPath = req.path.split('/');
        const logValues = auditLogsValues.find((item) => {
            if (item.url === splitedPath[item.position]) {
                return true;
            }
            return false;
        });
        if (logValues) {
            await auditLogManager.createAuditLog({
                userid: req.userid,
                log: logValues?.log,
                type: logValues?.type
            });
        }
        return next();
    } catch (err) {
        return next(err);
    }
};
