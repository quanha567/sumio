import { Controller, Inject, UseGuards } from "@nestjs/common";
import { authContract } from "@sumio/contract";
import { tsRestHandler, TsRestHandler } from "@ts-rest/nest";

import { type AuthenticatedUser, CurrentUser, FirebaseAuthGuard } from "@/modules/auth";
import { UpdateSettingsUseCase } from "@/modules/user/application/commands/update-settings/update-settings.use-case";
import { GetCurrentUserUseCase } from "@/modules/user/application/queries/get-current-user/get-current-user.use-case";

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
  public getMe(@CurrentUser() user: AuthenticatedUser) {
    return tsRestHandler(authContract.getMe, async () => {
      const profile = await this.getCurrentUserUseCase.execute(user.id);
      return { status: 200, body: profile };
    });
  }

  @TsRestHandler(authContract.updateSettings)
  public updateSettings(@CurrentUser() user: AuthenticatedUser) {
    return tsRestHandler(authContract.updateSettings, async ({ body }) => {
      const updated = await this.updateSettingsUseCase.execute({
        userId: user.id,
        dto: body,
      });
      return { status: 200, body: updated };
    });
  }
}
