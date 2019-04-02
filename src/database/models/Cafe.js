// @flow
import Sequelize from 'sequelize';
import db from 'database/db';
import { userInfo } from 'os';

export interface CafeModel {
  id: string,
  name: string,
  address: string,
}


const Cafe = db.define(
  'cafes',
  {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV1,
      primaryKey: true,   
    },
    name: Sequelize.STRING,
    address: Sequelize.STRING,
    long: Sequelize.FLOAT,
    lat: Sequelize.FLOAT,
    created_at: Sequelize.DATE,
    updated_at: Sequelize.DATE,
  }
);

Cafe.associate = function() {
  Cafe.hasOne
}