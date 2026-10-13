import type { MigrationInterface, QueryRunner } from "typeorm";

export class CreateCategoriesAndTransactions1700000000001 implements MigrationInterface {
  name = "CreateCategoriesAndTransactions1700000000001";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "categories" (
        "id" uuid NOT NULL,
        "userId" uuid NOT NULL,
        "name" character varying(100) NOT NULL,
        "type" character varying(10) NOT NULL,
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_categories_id" PRIMARY KEY ("id"),
        CONSTRAINT "CHK_categories_type" CHECK ("type" IN ('income', 'expense')),
        CONSTRAINT "UQ_categories_user_type_name" UNIQUE ("userId", "type", "name"),
        CONSTRAINT "FK_categories_user" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION
      );

      CREATE INDEX "IDX_categories_user_id" ON "categories" ("userId");

      CREATE TABLE "transactions" (
        "id" uuid NOT NULL,
        "userId" uuid NOT NULL,
        "categoryId" uuid NOT NULL,
        "type" character varying(10) NOT NULL,
        "amount" bigint NOT NULL,
        "currency" character(3) NOT NULL,
        "date" date NOT NULL,
        "description" character varying(255) NOT NULL DEFAULT '',
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_transactions_id" PRIMARY KEY ("id"),
        CONSTRAINT "CHK_transactions_type" CHECK ("type" IN ('income', 'expense')),
        CONSTRAINT "CHK_transactions_amount_positive" CHECK ("amount" > 0),
        CONSTRAINT "FK_transactions_user" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION,
        CONSTRAINT "FK_transactions_category" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE NO ACTION
      );

      CREATE INDEX "IDX_transactions_user_date" ON "transactions" ("userId", "date" DESC, "createdAt" DESC);
      CREATE INDEX "IDX_transactions_category_id" ON "transactions" ("categoryId");
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TABLE IF EXISTS "transactions";
      DROP TABLE IF EXISTS "categories";
    `);
  }
}
