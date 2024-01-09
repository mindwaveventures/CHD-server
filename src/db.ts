import { Sequelize, Dialect } from 'sequelize';

import appConfig from './app-config';

const {
    dbHost,
    dbPort,
    dbDialect,
    dbName,
    dbUser,
    dbPassword,
    dbInstanceName,
    mode
} = appConfig;

const db = new Sequelize({
    host: dbHost,
    port: dbPort,
    dialect: dbDialect as Dialect,
    database: dbName,
    username: dbUser,
    password: dbPassword,
    logging: mode === 'Development' || mode === 'Unknown',
    dialectOptions: {
        ...(dbInstanceName && { instanceName: dbInstanceName })
    }
});

export default db;


