export const Configs = {
  port: process.env.PORT ?? 3000,
  db_driver: process.env.DB_DRIVER ?? "mysql",
  db_user: process.env.DB_USER ?? "root",
  db_password: process.env.DB_PASSWORD ?? "root",
  db_host: process.env.DB_HOST ?? "localhost",
  db_port: process.env.DB_PORT ?? 3306,
  db_name: process.env.DB_NAME ?? "contacts",
};
