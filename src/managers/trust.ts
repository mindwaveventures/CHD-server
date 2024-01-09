// Trust model
import { Op } from 'sequelize';
import { Trust } from '../models';

// Request type
import {
    CreateTrust,
    UpdateTrust,
    TurstByStatus
} from '../types/request';

class TrustManager {
    createTrust(data: CreateTrust) {
        return Trust.create(data);
    }

    getTrustById(id: string) {
        return Trust.findOne({
            where: {
                id
            }
        });
    };

    getTrustByName(name: string) {
        return Trust.findOne({
            where: {
                name
            }
        });
    }

    updateTrustById(id: string, data: UpdateTrust) {
        return Trust.update(data, {
            where: {
                id
            }
        });
    }

    getAllTrustByStatus(data: TurstByStatus) {
        const query: any = {
            where: {
                status: data.status
            },
            order: [['name', 'ASC']]
        };
        if (data.searchText) {
            query.where = {
                status: data.status,
                name: {
                    [Op.iLike]: `%${data.searchText}%`
                }
            };
        }
        if (data.attributes) {
            query.attributes = data.attributes;
        }
        if (data.limit && data.page) {
            query.limit = data.limit;
            query.offset = data.limit * (data.page - 1);
        }
        return Trust.findAndCountAll(query);
    }

    getTrustIfStorageAccountNotExist(id: string) {
        return Trust.findAll({
            where: {
                id
            }
        });
    }
}

export default TrustManager;
