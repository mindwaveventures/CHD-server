import multer from 'multer';
import { usertypes } from '../constants';
import predictionCtrl from '../controllers/prediction';
import { auditLog, checkUserRolePermission } from '../middleware';

const upload = multer();

export default (router: any) => {
    router.post(
        '/upload-historic-data',
        checkUserRolePermission([usertypes.admin, usertypes.clinician]),
        upload.single('file'),
        auditLog,
        predictionCtrl.uploadHistoricData
    );
    router.post(
        '/upload-future-data',
        checkUserRolePermission([usertypes.admin, usertypes.clinician]),
        upload.single('file'),
        auditLog,
        predictionCtrl.uploadFutureData
    );
    router.post(
        '/get-predictions',
        checkUserRolePermission([usertypes.admin, usertypes.clinician]),
        predictionCtrl.getPredictionList
    );
    router.get(
        '/download-predictions/:id',
        checkUserRolePermission([usertypes.admin, usertypes.clinician, usertypes.superAdmin]),
        auditLog,
        predictionCtrl.downloadPrediction
    );
    router.get(
        '/check-prediction-status',
        checkUserRolePermission([usertypes.admin, usertypes.clinician]),
        predictionCtrl.checkPredictionStatus
    );
    router.post(
        '/get-prediction-by-organisation',
        checkUserRolePermission([usertypes.superAdmin]),
        predictionCtrl.getPredictionListByOrganisation
    );
    router.post(
        '/get-prediction-by-user',
        checkUserRolePermission([usertypes.admin, usertypes.clinician]),
        predictionCtrl.getPredictionListByUserId
    );

    router.get(
        '/get-prediction-by-id/:id',
        checkUserRolePermission([usertypes.admin, usertypes.clinician]),
        predictionCtrl.getPredictionById
    );
    router.get(
        '/get-user-resource',
        predictionCtrl.getResourceList
    );
    router.post(
        '/download-resource',
        predictionCtrl.downloadResource
    );
};