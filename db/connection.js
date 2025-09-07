import { Sequelize } from "sequelize";
import { Configs } from "../config/config.js";
import { Umzug, SequelizeStorage } from "umzug";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
    await runMigrations();
  } catch (e) {
    console.error("Unable to connect to the database or run migrations:", e);
    process.exit(1);
  }
}

async function runMigrations() {
  const queryInterface = sequelize.getQueryInterface();
  const umzug = new Umzug({
    migrations: {
      glob: path.join(__dirname, "..", "migrations", "*.js"),
    },
    context: { queryInterface, DataTypes: Sequelize.DataTypes },
    storage: new SequelizeStorage({ sequelize }),
    logger: console,
  });

  const pending = await umzug.pending();

  if (pending && pending.length > 0) {
    console.log(`Applying ${pending.length} pending migration(s)...`);
    await umzug.up();
    console.log("Migrations applied successfully.");
  } else {
    console.log("No pending migrations.");
  }
}
