import { Global, Module } from "@nestjs/common";

import { UserModule } from "@/modules/user/user.module";

import { JoseFirebaseTokenVerifier } from "./external/jose-firebase-token-verifier";
import { FirebaseAuthGuard } from "./guards/firebase-auth.guard";
import { TOKEN_VERIFIER } from "./ports/token-verifier.port";

@Global()
@Module({
  imports: [UserModule],
  providers: [
    {
      provide: TOKEN_VERIFIER,
      useClass: JoseFirebaseTokenVerifier,
    },
    FirebaseAuthGuard,
  ],
  exports: [TOKEN_VERIFIER, FirebaseAuthGuard, UserModule],
})
export class AuthModule {}
