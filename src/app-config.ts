import * as dotenv from 'dotenv';
import IConfig from './types/config';

dotenv.config();

const nodeEnv: any = process.env;

const config: IConfig = {
    ...nodeEnv,
    mode: nodeEnv.mode || 'Development',
    port: nodeEnv.port || 3002,
    host: nodeEnv.host || 'localhost',
    dbDialect: nodeEnv.dbDialect || 'postgres',
    dbName: nodeEnv.dbName || 'wnb',
    dbUser: nodeEnv.dbUser || 'postgres',
    dbPassword: nodeEnv.dbPassword || '',
    dbHost: nodeEnv.dbHost || 'localhost',
    dbPort: nodeEnv.dbPort || 5432,
    JWTSalt: nodeEnv.JWTSalt || '',
    jwtTokenAlgorithm: nodeEnv.jwtTokenAlgorithm || 'HS256',
    jwtAccessTokenExpiresIn: nodeEnv.jwtAccessTokenExpiresIn || '30m',
    jwtRefreshTokenExpiresIn: nodeEnv.jwtRefreshTokenExpiresIn || '1d',
    useSendgrid: nodeEnv.useSendgrid || true,
    apiVersion: nodeEnv.apiVersion || 'v1',
    messageBirdKey: nodeEnv.messageBirdKey || '',
    emailPort: nodeEnv.emailPort || 25,
    rateLimitInterval: nodeEnv.rateLimitInterval || 15,
    rateLimit: nodeEnv.rateLimit || 10
};

export default config;
