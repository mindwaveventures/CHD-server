import { auditLogCtrl } from '../controllers';
import { usertypes } from '../constants';
import { auditLogSchema } from '../request-schema';
import { requestPayloadValidator, checkUserRolePermission } from '../middleware';

export default (router: any) => {
    router.post(
        '/audit-log/:id?',
        checkUserRolePermission([usertypes.admin, usertypes.superAdmin]),
        requestPayloadValidator(auditLogSchema.getAuditLogs),
        auditLogCtrl.getAuditLogs
    );

    router.post(
        '/get-all-audit-log',
        checkUserRolePermission([usertypes.superAdmin]),
        auditLogCtrl.getAllAuditLogs
    );
};
