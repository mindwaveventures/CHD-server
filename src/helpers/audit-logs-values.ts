
const logTypes = {
    auditLog: 'AuditLog',
    user: 'User',
    trust: 'Trust',
    prediction: 'Prediction'
};

export default [
    {
        url: 'get-users-by-trust',
        position: 2,
        log: 'Get Users by trust',
        type: logTypes.trust
    },
    {
        url: 'upload-historic-data',
        position: 1,
        log: 'Uploaded historic data',
        type: logTypes.prediction
    },
    {
        url: 'upload-future-data',
        position: 1,
        log: 'Uploaded future data',
        type: logTypes.prediction
    },
    {
        url: 'download-predictions',
        position: 1,
        log: 'Downloaded prediction',
        type: logTypes.prediction
    },
    {
        url: 'manage-users',
        position: 2,
        log: 'Accepted/rejected user',
        type: logTypes.user
    },
];
