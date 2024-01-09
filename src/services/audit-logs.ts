import AuditLogManager from "../managers/audit-logs";
import { GetAuditLogs, GetAllAuditLogs } from "../types/request";

class AuditLogService {
    auditLogManager: AuditLogManager;
    constructor() {
        this.auditLogManager = new AuditLogManager();
    }

    async getAuditLogs(data: GetAuditLogs, trustId: string) {
        try {
            const { rows, count } = await this.auditLogManager.getAuditLog(data, trustId);
            const values = rows.map((item) => ({
                name: item.getDataValue('user')?.firstName + ' ' + item.getDataValue('user')?.lastName,
                date: item.getDataValue('createdAt'),
                log: item.getDataValue('log'),
                email: item.getDataValue('user')?.email
            }));
            return {
                count,
                data: values
            }
        } catch (err) {
            throw err;
        }
    }

    async getAllAuditLogs(data: GetAllAuditLogs) {
        try {
            const { rows, count } = await this.auditLogManager.getAllAuditLogs(data);
            const values = rows.map((item) => ({
                name: item.getDataValue('user')?.firstName + ' ' + item.getDataValue('user')?.lastName,
                date: item.getDataValue('createdAt'),
                log: item.getDataValue('log'),
                trustName: item.getDataValue('user')?.trust?.name,
                email: item.getDataValue('user')?.email,
                role: item.getDataValue('user')?.usertype
            }));
            return {
                count,
                data: values
            };
        } catch (err) {
            throw err;
        }
    }
}

export default AuditLogService;
