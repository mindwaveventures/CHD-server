import * as express from 'express';
import { Custom } from '../types';

const unless = (paths: Custom.UnauthorizedPaths[], middleware: any) => {
    return (req: express.Request, res: express.Response, next: express.NextFunction) => {
        const splitedPath = req.path.split('/');

        for (let i = 0; i < paths.length; i++) {
            const position = paths[i].position || 3;
            if (!req.path.includes('api') || paths[i].path === splitedPath[position]) {
                return next();
            }
        }

        return middleware(req, res, next);
    };
};

export default unless;