import { trustCtrl } from '../controllers';
import { trustSchema } from '../request-schema';
import { usertypes } from '../constants';
import { requestPayloadValidator, checkUserRolePermission } from '../middleware';

export default (router: any) => {
    router.post(
        '/trust',
        checkUserRolePermission([usertypes.superAdmin]),
        requestPayloadValidator(trustSchema.createTrustAndAdmin),
        trustCtrl.createTrustAndAdmin
    );
    router.put(
        '/trust',
        checkUserRolePermission([usertypes.superAdmin]),
        requestPayloadValidator(trustSchema.editTrust),
        trustCtrl.editTrust
    );
    router.post(
        '/trust/get-trust-by-status',
        checkUserRolePermission([usertypes.superAdmin]),
        requestPayloadValidator(trustSchema.trustByStatus),
        trustCtrl.getAllTrustByStatus
    );

    router.get('/trust/get-trust-name-id/:name?', trustCtrl.getTrustNameAndId);

    router.post(
        '/trust/retry-storage-account/:id',
        checkUserRolePermission([usertypes.superAdmin]),
        trustCtrl.recreateAzureStorageAccountIfNotExist
    );
};
