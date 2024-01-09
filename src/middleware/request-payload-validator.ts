import * as express from 'express';
import HttpStatus from '../helpers/httpstatus';

const requestPayloadValidator = (payloadSchema?: any, paramsSchema?: any, querySchema?: any) => (req: express.Request, res: express.Response, next: express.NextFunction) => {
    let validationResult: any = {};

    if (payloadSchema) {
        validationResult = payloadSchema.validate(req.body);
    }

    if (paramsSchema) {
        validationResult = paramsSchema.validate(req.params);
    }

    if (querySchema) {
        validationResult = querySchema.validate(req.query);
    }

    const { error } = validationResult;
    if (error) {
        const { details = [] } = error;
        const errorObject = details[0] || { message: 'Request payload validation failed' };
        const { message } = errorObject;

        return res.status(HttpStatus.BadRequest).send({ message });
    }

    return next();
};

export default requestPayloadValidator;
