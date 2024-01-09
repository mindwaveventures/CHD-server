import appConfig from './app-config';
import db from './db';

export default async () => {
    try {
        await db.authenticate();
        if (appConfig.mode !== 'production') {
            db.sync();
        }
    } catch (err: any) {
        console.log(`Database connection error: ${err.message}`);
        process.exit(1);
    }
};
