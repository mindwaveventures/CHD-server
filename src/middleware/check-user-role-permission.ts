import * as express from 'express';
import { HttpStatus } from '../helpers';

export default (types: string[]) => (req: express.Request, res: express.Response, next: express.NextFunction) => {

    if (types.indexOf(req.usertype) === -1)
        return res.status(HttpStatus.BadRequest).send({ message: 'You don\'t have permission to access this resource.' })

    return next();
};

