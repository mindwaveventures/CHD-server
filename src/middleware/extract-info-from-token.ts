import * as express from 'express';
import * as JSONWebToken from 'jsonwebtoken';

const extractInfo = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const authHeader = req.get('Authorization');

    if (authHeader) {
        const result = authHeader.split(' ');
        const token = result[1];

        const decodedToken = JSONWebToken.decode(token, { json: true });
        if (decodedToken) {
            const { id, usertype, trustId } = decodedToken;
            // Set the required data from decoded token
            req.userid = id;
            req.usertype = usertype;
            req.trustId = trustId;
        }
    }

    return next();
};

export default extractInfo;
