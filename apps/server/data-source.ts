import { join } from "path";
import "reflect-metadata";

import dotenv from "dotenv";
import { DataSource } from "typeorm";

const isProd = process.env.NODE_ENV === "production";
const path = join(process.cwd(), `./.env.${isProd ? "prod" : "dev"}`);
dotenv.config({ path });

export default new DataSource({
  type: "postgres",
  url: process.env.DB_URL,
  entities: ["src/**/*.entity.{ts,js}"],
  migrations: ["src/migrations/*.{ts,js}"],
  migrationsTableName: "migrations",
  synchronize: false,
  ssl: isProd ? { rejectUnauthorized: false } : false,
});
