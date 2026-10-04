import { Module } from "@nestjs/common";

import { SyncUserUseCase } from "./application/commands/sync-user/sync-user.use-case.js";
import { UpdateSettingsUseCase } from "./application/commands/update-settings/update-settings.use-case.js";
import { TOKEN_VERIFIER } from "./application/ports/token-verifier.port.js";
import { GetCurrentUserUseCase } from "./application/queries/get-current-user/get-current-user.use-case.js";
import { USER_REPOSITORY } from "./domain/repositories/user.repository.interface.js";
import { JoseFirebaseTokenVerifier } from "./infrastructure/external/jose-firebase-token-verifier.js";
import { TypeOrmUserRepository } from "./infrastructure/persistence/repositories/typeorm-user.repository.js";
import { FirebaseAuthGuard } from "./interface/guards/firebase-auth.guard.js";
import { AuthController } from "./interface/http/auth.controller.js";

@Module({
  controllers: [AuthController],
  providers: [
    {
      provide: USER_REPOSITORY,
      useClass: TypeOrmUserRepository,
    },
    {
      provide: TOKEN_VERIFIER,
      useClass: JoseFirebaseTokenVerifier,
    },
    SyncUserUseCase,
    GetCurrentUserUseCase,
    UpdateSettingsUseCase,
    FirebaseAuthGuard,
  ],
  exports: [
    USER_REPOSITORY,
    TOKEN_VERIFIER,
    SyncUserUseCase,
    GetCurrentUserUseCase,
    FirebaseAuthGuard,
  ],
})
export class UserModule {}
