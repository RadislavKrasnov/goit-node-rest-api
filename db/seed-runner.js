import 'dotenv/config';
import { sequelize } from "./connection.js";
import { Umzug, SequelizeStorage } from "umzug";
import path from "path";
import { fileURLToPath } from "url";
import { Sequelize } from "sequelize";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const seeder = new Umzug({
  migrations: {
    glob: path.join(__dirname, "..", "seeders", "*.js"),
  },
  context: {
    queryInterface: sequelize.getQueryInterface(),
    DataTypes: Sequelize.DataTypes
  },
  storage: new SequelizeStorage({ sequelize, tableName: "SequelizeData" }),
  logger: console,
});

export async function runSeeds() {
  const pending = await seeder.pending();
  if (pending.length) {
    console.log(`Running ${pending.length} seeds...`);
    await seeder.up();
    console.log("Seeds applied.");
  } else {
    console.log("No pending seeds.");
  }
}

try {
  await sequelize.authenticate();
  console.log("Database connected!");
  await runSeeds();
  await sequelize.close();
  console.log("Done!");
} catch (err) {
  console.error("Error running seeds:", err);
  process.exit(1);
}
