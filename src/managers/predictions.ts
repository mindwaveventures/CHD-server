import {
    Predictions,
    User,
    Trust
} from '../models';
import {
    CreatePrediction,
    UpdatePrediction,
    GetPredictionByUserId,
    GetPredictionByTrustId
} from '../types/request';
import { containerNames, fileUploadStatus } from '../constants';

class PredictionManager {
    createPrediction(data: CreatePrediction) {
        return Predictions.create(data);
    }

    updatePrediction(id: string, data: UpdatePrediction) {
        return Predictions.update(data, {
            where: {
                id
            }
        });
    }

    getPredictionByUserId(userId: string, data: GetPredictionByUserId) {
        const query: any = {
            where: {
                userId,
                type: containerNames.future,
                status: fileUploadStatus.completed
            },
            order: [['updatedAt', 'DESC']]
        };
        if (data.limit && data.page) {
            query.limit = data.limit;
            query.offset = data.limit * (data.page - 1);
        }
        return Predictions.findAndCountAll(query);
    }

    getPredictonByOrganisationId(data: GetPredictionByTrustId) {
        const { trustId } = data;
        const userRelation: any = {
            model: User,
            as: 'user',
            where: {
                trustId
            },
            attributes: [
                'firstName',
                'lastName'
            ],
        };
        if (data.userId !== 'all') {
            userRelation.where.id = data.userId
        }
        const query: any = {
            where: {
                type: containerNames.future,
                status: fileUploadStatus.completed
            },
            include: [userRelation],
            order: [['updatedAt', 'DESC']]
        };
        if (data.limit && data.page) {
            query.limit = data.limit;
            query.offset = data.limit * (data.page - 1);
        }
        return Predictions.findAndCountAll(query);
    }

    getPredictionById(id: string) {
        return Predictions.findOne({
            where: {
                id
            },
            include: [{
                model: User,
                as: 'user',
                include: [{
                    model: Trust,
                    as: 'trust'
                }]
            }]
        });
    }

    getLastPrediction(id: string) {
        return Predictions.findOne({
            include: [{
                model: User,
                as: 'user',
                include: [{
                    model: Trust,
                    as: 'trust',
                    where: {
                        id
                    }
                }]
            }],
            order: [['updatedAt', 'DESC']]
        })
    }

    getLastPredictionByUserId(userId: string) {
        return Predictions.findOne({
            where: {
                userId
            },
            order: [['updatedAt', 'DESC']]
        });
    }

    getPredictionByStatus(status: string) {
        return Predictions.findAll({
            where: {
                status
            }
        });
    }

    deletePrediction(id: string){
        return Predictions.destroy({
            where: {
                id
            }
        });
    }
}

export default PredictionManager;
