import Joi from '@hapi/joi';

const createTrustAndAdmin = Joi.object({
    name: Joi.string().required().label('Name'),
    firstName: Joi.string().required().label('First name'),
    lastName: Joi.string().optional().allow('').label('Last name'),
    email: Joi.string().required().label('Email')
});

const editTrust = Joi.object({
    name: Joi.string().optional().label('Trust name'),
    id: Joi.string().required().label('Id is required'),
    status: Joi.string().optional().label('Status is Optional'),
    reason: Joi.string().optional().allow('').label('Reason')
});

const trustByStatus = Joi.object({
    status: Joi.string().required().label('Status'),
    limit: Joi.number().greater(0).optional().label('Limit'),
    page: Joi.number().greater(0).optional().label('Page'),
    searchText: Joi.string().optional().allow("").label('Search Text')
});

export {
    createTrustAndAdmin,
    editTrust,
    trustByStatus
};
