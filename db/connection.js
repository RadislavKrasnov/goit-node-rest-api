import { Sequelize } from "sequelize";
import { Configs } from "../config/config.js";

const dbDriver = Configs.db_driver;
const dbUser = Configs.db_user;
const dbPassword = Configs.db_password;
const dbHost = Configs.db_host;
const dbPort = Configs.db_port;
const dbName = Configs.db_name;

const dbConnectionUrl = `${dbDriver}://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/${dbName}?sslmode=require`;
export const sequelize = new Sequelize(dbConnectionUrl);

export async function initDB() {
  try {
    await sequelize.authenticate();
    console.log("Database connection successful.");
  } catch (e) {
    console.error("Unable to connect to the database:", e);
    process.exit(1);
  }
}
