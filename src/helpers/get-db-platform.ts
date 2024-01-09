import { QueryTypes } from 'sequelize';
import db from '../db';

export default async (): Promise<string> => {
    try {
        const result = await db.query(`
            select version();
        `, {
            type: QueryTypes.SELECT,
            raw: true
        });

        const data: any = result[0];
        if (data) {
            return data?.version;
        }

        return 'Unknown';
    } catch (err) {
        return 'Unable to fetch';
    }
};
