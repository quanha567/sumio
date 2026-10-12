import { Module } from "@nestjs/common";

import { CategorySeedingModule } from "@/modules/category/category-seeding.module";

import { SyncUserUseCase } from "./application/commands/sync-user/sync-user.use-case";
import { UpdateSettingsUseCase } from "./application/commands/update-settings/update-settings.use-case";
import { GetCurrentUserUseCase } from "./application/queries/get-current-user/get-current-user.use-case";
import { USER_REPOSITORY } from "./domain/repositories/user.repository.interface";
import { TypeOrmUserRepository } from "./infrastructure/persistence/repositories/typeorm-user.repository";
import { AuthController } from "./interface/http/auth.controller";

@Module({
  imports: [CategorySeedingModule],
  controllers: [AuthController],
  providers: [
    {
      provide: USER_REPOSITORY,
      useClass: TypeOrmUserRepository,
    },
    SyncUserUseCase,
    GetCurrentUserUseCase,
    UpdateSettingsUseCase,
  ],
  exports: [USER_REPOSITORY, SyncUserUseCase, GetCurrentUserUseCase, UpdateSettingsUseCase],
})
export class UserModule {}
