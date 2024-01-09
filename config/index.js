const dotenv = require('dotenv');
dotenv.config();
const env = process.env;

const config = {
  "development": {
    "username": env.dbUser,
    "password": env.dbPassword,
    "database": env.dbName,
    "host": env.dbHost,
    "dialect": env.dbDialect,
    "seederStorage": "sequelize",
  },
  "test": {
    "username": env.dbUser,
    "password": env.dbPassword,
    "database": env.dbName,
    "host": env.dbHost,
    "dialect": env.dbDialect,
    "seederStorage": "sequelize",
  },
  "production": {
    "username": env.dbUser,
    "password": env.dbPassword,
    "database": env.dbName,
    "host": env.dbHost,
    "dialect": env.dbDialect,
    "seederStorage": "sequelize",
  }
}

module.exports = config;
