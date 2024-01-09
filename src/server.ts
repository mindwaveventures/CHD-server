import * as http from 'http';
import express from 'express';

import appConfig from './app-config';
import db from './db';
import configureDb from './configure-db';
import configureExpress from './configure-express';
import { getDbPlatform, nodemailerManager } from './helpers';
import TrustService from './services/trust';
import PredictionService from './services/predictions';

const trustService = new TrustService();
const predictionService = new PredictionService();

const app = express();
let server: http.Server;

const start = async () => {
    const { port, host, mode, dbHost, dbName } = appConfig;
    await configureDb();
    // nodemailerManager({
    //     to: 'sannthoshkodi@outlook.com',
    //     subject: 'test',
    //     html: '<p>test</p>'
    // });
    const DbPlatform = await getDbPlatform();
    configureExpress(app);
    await trustService.createInitialTrustAndAdmin();
    predictionService.checkPendingRequest();
    server = app.listen(port, host, () => {
        console.log(`
------------------------------------------------------------
🚀 Server starts and listening on http://${host}:${port}
   Node Version: ${process.version}
     Process Id: ${process.pid}
           Mode: ${mode}

        Db Host: ${dbHost}
       Database: ${dbName}
             OS: ${DbPlatform}
------------------------------------------------------------
`);
        console.log('Press CTRL+C to stop the server\n');
    });
};

process.on('SIGINT', () => {
    if (server) {
        server.close();
    }

    if (db) {
        db.close();
    }
});

const close = () => {
    process.emit('SIGINT', 'SIGINT');
};

export {
    start,
    close
};
