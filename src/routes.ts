import authRoute from './routes/auth'
import trustRoute from './routes/trust';
import auditLogRoute from './routes/audit-log';
import predictionRoute from './routes/prediction';

export default (router: any) => {
    authRoute(router);
    trustRoute(router);
    auditLogRoute(router);
    predictionRoute(router);
};