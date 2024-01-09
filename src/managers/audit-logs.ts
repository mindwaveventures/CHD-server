// Audit log model
import { Op } from 'sequelize';
import { AuditLog, Trust, User } from '../models';

import { CreateAuditLog, GetAuditLogs, GetAllAuditLogs } from '../types/request';

class AuditLogManager {
    createAuditLog(data: CreateAuditLog) {
        return AuditLog.create(data);
    }

    getAuditLog(data: GetAuditLogs, trustId: string) {
        const query: any = {
            include: [{
                model: User,
                as: "user",
                attributes: [
                    'firstName',
                    'lastName',
                    'email'
                ],
                where: {
                    trustId
                }
            }],
            attributes: [
                'id',
                'log',
                'createdAt'
            ],
            order: [['createdAt', 'DESC']]
        };
        const date = [];
        if (data.fromDate) {
            date.push({
                createdAt: {
                    [Op.gte]: new Date(data.fromDate)
                },
            })
        }
        if (data.toDate) {
            date.push({
                createdAt: {
                    [Op.lte]: new Date(data.toDate).setDate(new Date(data.toDate).getDate() + 1)
                }
            });
        }
        query.where = {
            [Op.and]: date
        };
        if (data.limit && data.page) {
            const { limit, page } = data;
            query.limit = limit;
            query.offset = limit * (page - 1);
        }
        if (data.searchText) {
            const { searchText } = data;
            query.include = [{
                model: User,
                as: "user",
                attributes: [
                    'firstName',
                    'lastName',
                    'email'
                ],
                where: {
                    [Op.or]: [{
                        firstName: {
                            [Op.iLike]: `%${searchText}%`
                        }
                    }, {
                        lastName: {
                            [Op.iLike]: `%${searchText}%`
                        }
                    }]
                }
            }];
        }
        return AuditLog.findAndCountAll(query);
    }

    getAllAuditLogs(data: GetAllAuditLogs) {
        const query: any = {
            include: [{
                model: User,
                as: "user",
                attributes: [
                    'firstName',
                    'lastName',
                    'email'
                ],
                include: [{
                    model: Trust,
                    as: 'trust',
                    attributes: [
                        'name'
                    ],
                }],
                where: data.organisationId === 'all' ? {} : {
                    trustId: data.organisationId
                }
            }],
            attributes: [
                'id',
                'log',
                'createdAt'
            ],
            order: [['createdAt', 'DESC']]
        };
        const date = [];
        if (data.fromDate) {
            date.push({
                createdAt: {
                    [Op.gte]: new Date(data.fromDate)
                },
            })
        }
        if (data.toDate) {
            date.push({
                createdAt: {
                    [Op.lte]: new Date(data.toDate).setDate(new Date(data.toDate).getDate() + 1)
                }
            });
        }
        query.where = {
            [Op.and]: date
        };
        if (data.limit && data.page) {
            const { limit, page } = data;
            query.limit = limit;
            query.offset = limit * (page - 1);
        }
        if (data.searchText) {
            const { searchText } = data;
            query.include = [{
                model: User,
                as: "user",
                attributes: [
                    'firstName',
                    'lastName',
                    'email'
                ],
                where: {
                    [Op.or]: [{
                        firstName: {
                            [Op.iLike]: `%${searchText}%`
                        }
                    }, {
                        lastName: {
                            [Op.iLike]: `%${searchText}%`
                        }
                    }, {
                        email: {
                            [Op.iLike]: `%${searchText}%`
                        }
                    }]
                }
            }];
        }
        return AuditLog.findAndCountAll(query);
    }
}

export default AuditLogManager;
