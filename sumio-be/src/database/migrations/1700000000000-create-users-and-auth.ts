import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUsersAndAuth1700000000000 implements MigrationInterface {
  name = "CreateUsersAndAuth1700000000000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "users" (
        "id" uuid NOT NULL,
        "email" character varying(255) NOT NULL,
        "displayName" character varying(255),
        "photoUrl" text,
        "status" character varying(20) NOT NULL DEFAULT 'ACTIVE',
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_users_email" UNIQUE ("email"),
        CONSTRAINT "PK_users_id" PRIMARY KEY ("id")
      );

      CREATE INDEX IF NOT EXISTS "IDX_users_email" ON "users" ("email");

      CREATE TABLE IF NOT EXISTS "user_identities" (
        "id" uuid NOT NULL,
        "userId" uuid NOT NULL,
        "provider" character varying(50) NOT NULL,
        "providerUid" character varying(255) NOT NULL,
        "claims" jsonb NOT NULL DEFAULT '{}',
        "lastSignInAt" TIMESTAMP WITH TIME ZONE,
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_user_identities_provider_uid" UNIQUE ("providerUid"),
        CONSTRAINT "PK_user_identities_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_user_identities_user" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION
      );

      CREATE INDEX IF NOT EXISTS "IDX_user_identities_user_id" ON "user_identities" ("userId");
      CREATE INDEX IF NOT EXISTS "IDX_user_identities_provider_uid" ON "user_identities" ("providerUid");

      CREATE TABLE IF NOT EXISTS "user_settings" (
        "userId" uuid NOT NULL,
        "baseCurrency" character varying(3) NOT NULL DEFAULT 'USD',
        "locale" character varying(20) NOT NULL DEFAULT 'en-US',
        "theme" character varying(50) NOT NULL DEFAULT 'mint',
        "weekStartsOn" smallint NOT NULL DEFAULT 1,
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_user_settings_user_id" PRIMARY KEY ("userId"),
        CONSTRAINT "FK_user_settings_user" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TABLE IF EXISTS "user_settings";
      DROP TABLE IF EXISTS "user_identities";
      DROP TABLE IF EXISTS "users";
    `);
  }
}
