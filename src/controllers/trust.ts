import * as express from 'express';

import TrustService from '../services/trust';
import { HttpStatus } from '../helpers';

const createTrustAndAdmin = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const trustService = new TrustService();
    try {
        await trustService.createTrustAndAdmin(req.body);
        return res.status(HttpStatus.Created).send({ message: 'Trust and admin created Successfully' });
    } catch (err) {
        return next(err);
    }
};

const editTrust = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const trustService = new TrustService();
    try {
        await trustService.editTrust(req.body);
        return res.status(HttpStatus.OK).send({ message: 'Trust Edited Successfully' });
    } catch (err) {
        return next(err);
    }
};

const getAllTrustByStatus = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const trustService = new TrustService();
    try {
        const data = await trustService.getAllTrustByStatus(req.body);
        return res.status(HttpStatus.OK).send(data);
    } catch (err) {
        return next(err);
    }
};

const getTrustNameAndId = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const trustService = new TrustService();
    try {
        const data = await trustService.getTrustNameAndId(req.params.name || '');
        return res.status(HttpStatus.OK).send(data);
    } catch (err) {
        return next(err);
    }
};

const recreateAzureStorageAccountIfNotExist = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const trustService = new TrustService();
    try {
        await trustService.recreateAzureStorageAccountIfNotExist(req.params.id);
        return res.status(HttpStatus.OK).send({ message: 'Account recreation started' });
    } catch (err) {
        return next(err);
    }
};

export default {
    createTrustAndAdmin,
    editTrust,
    getAllTrustByStatus,
    getTrustNameAndId,
    recreateAzureStorageAccountIfNotExist
};
