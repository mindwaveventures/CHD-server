import * as express from 'express';
import * as JSONWebToken from 'jsonwebtoken';

import { CustomError, HttpStatus, ErrorCodes } from '../helpers';
import config from '../app-config';
import UserManager from '../managers/users';
import { trustStatus, userStatus } from '../constants';

const {
    userArchived,
    trustArchived,
    userNotApproved,
    userRejected,
    roleChanged
} = ErrorCodes

const _verifyToken = (token: string, tokenType: string) => {
    try {
        const { jwtAccessTokenSecretKey, jwtRefershTokenSecretKey } = config;
        return JSONWebToken.verify(token, tokenType === 'accesstoken' ? jwtAccessTokenSecretKey : jwtRefershTokenSecretKey);
    } catch (err) {
        return null;
    }
};

const _generateToken = (payload: any) => {
    const {
        jwtAccessTokenSecretKey,
        jwtAccessTokenExpiresIn,
        jwtTokenAlgorithm
    } = config;

    const accessTokenOptions: any = {
        algorithm: jwtTokenAlgorithm,
        expiresIn: jwtAccessTokenExpiresIn
    };

    return JSONWebToken.sign(payload, jwtAccessTokenSecretKey, accessTokenOptions);
};

const authorization = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const authHeader = req.get('Authorization');
    const refreshToken = req.get('x-refresh');

    if (!authHeader || !refreshToken) {
        return res.status(HttpStatus.Unauthorized).send({ message: 'Authorization header not found.' });
    }

    const result = authHeader.split(' ');
    if (result.length < 2) {
        return res.status(HttpStatus.Unauthorized).send({ message: 'Token not found.' });
    }

    const tokenType = result[0];
    const token = result[1];
    if (tokenType !== 'Bearer') {
        return res.status(HttpStatus.Unauthorized).send({ message: 'Invalid token type.' });
    }

    try {
        const accessTokenValid: any = _verifyToken(token, 'accesstoken');
        const userManager = new UserManager();
        if (!accessTokenValid) {
            const refereshTokenPayload: any = _verifyToken(refreshToken, 'refreshtoken');
            if (!refereshTokenPayload) {
                return res.status(HttpStatus.Unauthorized).send({ message: 'Session Expired' });
            }
            delete refereshTokenPayload.iat;
            delete refereshTokenPayload.exp;
            const newAccessToken = _generateToken(refereshTokenPayload);
            await userManager.updateUserById(refereshTokenPayload?.id || '', {
                accessToken: newAccessToken
            });
            res.setHeader('x-access-token', newAccessToken);
            return next();
        }
        const user = await userManager.getUserById(accessTokenValid?.id || '');
        if (user?.getDataValue('accessToken') !== token) {
            return res.status(HttpStatus.Unauthorized).send({ message: 'Invalid Token' });
        }
        if (user.getDataValue('usertype') !== accessTokenValid.usertype) {
            throw new CustomError(roleChanged.message, roleChanged.errorCode, roleChanged.statusCode);
        }
        if (user.getDataValue('trust') && user.getDataValue('trust')?.status !== trustStatus.active) {
            throw new CustomError(trustArchived.message, trustArchived.errorCode, trustArchived.statusCode);
        }
        if (user?.getDataValue('status') === userStatus.requested) {
            throw new CustomError(userNotApproved.message, userNotApproved.errorCode, userNotApproved.statusCode);
        }
        if (user?.getDataValue('status') === userStatus.rejected) {
            throw new CustomError(userRejected.message, userRejected.errorCode, userRejected.statusCode);
        }
        if (user?.getDataValue('status') === userStatus.delete) {
            throw new CustomError(userArchived.message, userArchived.errorCode, userArchived.statusCode);
        }
        if (user.getDataValue('trust')?.name !== accessTokenValid.trustName) {
            res.setHeader('x-trust-name', user.getDataValue('trust')?.name || '');
        }
        return next();
    } catch (err) {
        return next(err);
    }
};

export default authorization;