import pg from "pg";
import { DataSource } from "typeorm";

import { ORM_ENTITIES } from "./database.module.js";

const databaseUrl = process.env.DATABASE_URL;

export default new DataSource({
  type: "postgres",
  driver: pg,
  url: databaseUrl,
  entities: ORM_ENTITIES,
  migrations: ["src/database/migrations/*.ts"],
  synchronize: false,
  ssl:
    process.env.DATABASE_SSL === "true" || (databaseUrl && !databaseUrl.includes("localhost"))
      ? { rejectUnauthorized: false }
      : false,
});
