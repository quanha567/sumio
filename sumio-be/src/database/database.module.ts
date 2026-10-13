import type { OnModuleDestroy } from "@nestjs/common";
import { Global, Module } from "@nestjs/common";
import pg from "pg";
import { DataSource } from "typeorm";

import { CategoryOrmEntity } from "@/modules/category/infrastructure/persistence/entities/category.orm-entity";
import { TransactionOrmEntity } from "@/modules/transaction/infrastructure/persistence/entities/transaction.orm-entity";
import { UserIdentityOrmEntity } from "@/modules/user/infrastructure/persistence/entities/user-identity.orm-entity";
import { UserSettingsOrmEntity } from "@/modules/user/infrastructure/persistence/entities/user-settings.orm-entity";
import { UserOrmEntity } from "@/modules/user/infrastructure/persistence/entities/user.orm-entity";

export const ORM_ENTITIES = [
  UserOrmEntity,
  UserIdentityOrmEntity,
  UserSettingsOrmEntity,
  CategoryOrmEntity,
  TransactionOrmEntity,
];

export const createDataSource = (): DataSource => {
  const rawDatabaseUrl = process.env.DATABASE_URL;
  const databaseUrl = rawDatabaseUrl
    ? rawDatabaseUrl.replaceAll(/%(?![0-9a-fA-F]{2})/gu, "%25")
    : undefined;

  return new DataSource({
    type: "postgres",
    driver: pg,
    url: databaseUrl || "postgresql://postgres:postgres@localhost:5432/sumio",
    entities: ORM_ENTITIES,
    synchronize: false,
    logging: process.env.NODE_ENV === "development",
    connectTimeoutMS: 5000,
    extra: {
      connectionTimeoutMillis: 5000,
    },
    ssl:
      process.env.DATABASE_SSL === "true" || (databaseUrl && !databaseUrl.includes("localhost"))
        ? { rejectUnauthorized: false }
        : false,
  });
};

@Global()
@Module({
  providers: [
    {
      provide: DataSource,
      useFactory: () => {
        return createDataSource();
      },
    },
  ],
  exports: [DataSource],
})
export class DatabaseModule implements OnModuleDestroy {
  constructor(private readonly dataSource: DataSource) {}

  public async onModuleDestroy() {
    if (this.dataSource?.isInitialized) {
      await this.dataSource.destroy();
    }
  }
}
