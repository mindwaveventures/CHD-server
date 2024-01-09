import Joi from '@hapi/joi';

const getAuditLogs = Joi.object({
    limit: Joi.number().greater(0).optional().label('Limit'),
    page: Joi.number().greater(0).optional().label('Page'),
    searchText: Joi.string().optional().allow("").label('Search Text'),
    fromDate: Joi.string().optional().label('From date').allow(null, ''),
    toDate: Joi.string().optional().label('To date').allow(null, '')
});

export {
    getAuditLogs
};
