// @flow
import Sequelize from 'sequelize';

const { POSTGRES_HOST, POSTGRES_USER, POSTGRES_PW } = process.env;

const db = new Sequelize('', POSTGRES_USER, POSTGRES_PW, {
  host: POSTGRES_HOST || 'localhost:5324',
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

export default db;