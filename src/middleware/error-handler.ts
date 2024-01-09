import * as express from 'express';

import { HttpStatus } from '../helpers';
import config from '../app-config';

const errorHandler = (err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError' || err.name === 'NotBeforeError') {
        return res.status(HttpStatus.Unauthorized).send({ message: err.message });
    } else if (err.type && err.type === 'CustomError') {
        if (err.errorCode) {
            return res.status(err.statusCode).send({ message: err.message, errorCode: err.errorCode });
        }
        return res.status(err.statusCode).send({ message: err.message });
    }
    if (config.mode === 'Production') {
        return res.status(HttpStatus.InternalServerError).send({ message: 'Something went wrong.' });
    } else if (err.name.includes('Sequelize')) { // any error from sequelize
        if (err.errors && err.errors[0].message) {
            return res.status(HttpStatus.BadRequest).send({ message: err.errors[0].message });
        }
        return res.status(HttpStatus.BadRequest).send({ message: err.message });
    } else if (err.code && err.message) { // Any error with code and message
        return res.status(HttpStatus.BadRequest).send({
            code: err.code,
            message: err.message
        });
    } else if (err.message) { // Any error with only message
        if (config.mode === 'development' || config.mode === 'testing') {
            console.log(err);
        }
        return res.status(HttpStatus.BadRequest).send({ message: err.message });
    } else if (err.stack) {
        return res.status(HttpStatus.BadRequest).send({ message: err.stack });
    }

    return res.status(HttpStatus.InternalServerError).send({ message: 'Something went wrong.' });
};

export default errorHandler;
