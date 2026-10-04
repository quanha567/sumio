import { Controller, Inject, UseGuards } from "@nestjs/common";
import { authContract } from "@sumio/contract";
import { tsRestHandler, TsRestHandler } from "@ts-rest/nest";

import { UpdateSettingsUseCase } from "../../application/commands/update-settings/update-settings.use-case.js";
import { GetCurrentUserUseCase } from "../../application/queries/get-current-user/get-current-user.use-case.js";
import { User } from "../../domain/entities/user.entity.js";
import { CurrentUser } from "../decorators/current-user.decorator.js";
import { FirebaseAuthGuard } from "../guards/firebase-auth.guard.js";

@Controller()
@UseGuards(FirebaseAuthGuard)
export class AuthController {
  constructor(
    @Inject(GetCurrentUserUseCase)
    private readonly getCurrentUserUseCase: GetCurrentUserUseCase,
    @Inject(UpdateSettingsUseCase)
    private readonly updateSettingsUseCase: UpdateSettingsUseCase,
  ) {}

  @TsRestHandler(authContract.getMe)
  public getMe(@CurrentUser() user: User) {
    return tsRestHandler(authContract.getMe, async () => {
      const profile = await this.getCurrentUserUseCase.execute(user.id.value);
      return { status: 200, body: profile };
    });
  }

  @TsRestHandler(authContract.updateSettings)
  public updateSettings(@CurrentUser() user: User) {
    return tsRestHandler(authContract.updateSettings, async ({ body }) => {
      const updated = await this.updateSettingsUseCase.execute({
        userId: user.id.value,
        dto: body,
      });
      return { status: 200, body: updated };
    });
  }
}
