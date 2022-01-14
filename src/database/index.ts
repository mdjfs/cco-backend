import {
  Model,
  ModelCtor,
  Sequelize,
  SequelizeOptions,
} from "sequelize-typescript";

import User from "./models/user";

import config from "../config";
import Product from "./models/product";

const env = process.env.NODE_ENV || "development";

const databaseConfig: SequelizeOptions = config.database[env];

/**
 * Sync database
 */
async function createDatabase() {
  const database = getDatabase();
  await database.sequelize.sync({ force: true });
  return database;
}

/**
 * Get database object
 * @returns {Array[Sequelize, Models]}
 */
function getDatabase() {
  const sequelize = new Sequelize(databaseConfig);
  sequelize.addModels([User, Product]);
  return {
    sequelize: sequelize,
    models: {
      User: User,
      Product: Product,
    },
  };
}

export { createDatabase, getDatabase };
export default getDatabase();
