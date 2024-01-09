import * as express from 'express';
import { createReadStream, rmSync } from 'fs';
import { HttpStatus } from '../helpers';
import PredictionService from '../services/predictions';

const uploadHistoricData = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const predictionService = new PredictionService();
    try {
        const predictionId = await predictionService.uploadHistoricData(req.userid, req.trustId, req.file, req.body);
        return res.status(HttpStatus.OK).send({ message: 'Historic data uploaded successfully', predictionId });
    } catch (err) {
        return next(err);
    }
};

const uploadFutureData = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const predictionService = new PredictionService();
    try {
        const predictionId = await predictionService.uploadFutureData(req.userid, req.trustId, req.file, req.body);
        return res.status(HttpStatus.OK).send({ message: 'Future data uploaded successfully', predictionId });
    } catch (err) {
        return next(err);
    }
};

const getPredictionList = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const predictionService = new PredictionService();
    try {
        const result = await predictionService.getPredictionList(req.userid, req.body);
        return res.status(HttpStatus.OK).send(result);
    } catch (err) {
        return next(err);
    }
};

const downloadPrediction = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const predictionService = new PredictionService();
    try {
        const { data, fileName } = await predictionService.downloadPrediction(req.params.id);
        res.setHeader('file-name', fileName || 'download.zip');
        res.attachment(fileName);
        data?.pipe(res);
    } catch (err) {
        return next(err);
    }
};

const checkPredictionStatus = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const predictionService = new PredictionService();
    try {
        const data = await predictionService.checkPredictionStatus(req.trustId, req.userid);
        return res.status(HttpStatus.OK).send({ data });
    } catch (err) {
        return next(err);
    }
};

const getPredictionListByOrganisation = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const predictionService = new PredictionService();
    try {
        const data = await predictionService.getPredictionListByOrganisation(req.body);
        return res.status(HttpStatus.OK).send({ data });
    } catch (err) {
        return next(err);
    }
};

const getPredictionListByUserId = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const predictionService = new PredictionService();
    try {
        const data = await predictionService.getPredictionListByOrganisation({
            ...req.body,
            trustId: req.trustId
        });
        return res.status(HttpStatus.OK).send({ data });
    } catch (err) {
        return next(err);
    }
};

const getPredictionById = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const predictionService = new PredictionService();
    try {
        const data = await predictionService.getPredictionById(req.params.id);
        return res.status(HttpStatus.OK).send({ data });
    } catch (err) {
        return next(err);
    }
};

const getResourceList = async (req: express.Request, res: express.Response, next: express.NextFunction)=>{
    const predictionService = new PredictionService();
    try{
        const data =  await predictionService.getResourceList(req.usertype);
        return res.status(HttpStatus.OK).send({data});
    }catch(err){
        return next(err);
    }
};

const downloadResource = async (req: express.Request, res: express.Response, next: express.NextFunction)=>{
    const predictionService = new PredictionService();
    try{
        const {data, fileName} =  await predictionService.downloadResource(req.usertype, req.body.fileName);
        res.setHeader('file-name', fileName || 'download.zip');
        res.attachment(fileName);
        data?.pipe(res);
    }catch(err){
        return next(err);
    }
};

export default {
    uploadHistoricData,
    uploadFutureData,
    getPredictionList,
    downloadPrediction,
    checkPredictionStatus,
    getPredictionListByOrganisation,
    getPredictionListByUserId,
    getPredictionById,
    getResourceList,
    downloadResource
};
