import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import type { UserProfileDto } from "@sumio/contract";

import { IUseCase } from "../../../../../shared/application/use-case.interface.js";
import {
  type IUserRepository,
  USER_REPOSITORY,
} from "../../../domain/repositories/user.repository.interface.js";
import { UserId } from "../../../domain/value-objects/user-id.vo.js";

@Injectable()
export class GetCurrentUserUseCase implements IUseCase<string, UserProfileDto> {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  public async execute(userIdString: string): Promise<UserProfileDto> {
    const userId = UserId.create(userIdString);
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new NotFoundException(`User with id ${userIdString} was not found.`);
    }

    return {
      id: user.id.value,
      email: user.email.value,
      displayName: user.displayName,
      photoUrl: user.photoUrl,
      status: user.status,
      settings: {
        baseCurrency: user.settings.baseCurrency.code,
        locale: user.settings.locale,
        theme: user.settings.theme,
        weekStartsOn: user.settings.weekStartsOn,
        updatedAt: user.settings.updatedAt.toISOString(),
      },
      identities: user.identities.map((identity) => ({
        id: identity.id,
        provider: identity.provider,
        providerUid: identity.providerUid,
        lastSignInAt: identity.lastSignInAt ? identity.lastSignInAt.toISOString() : null,
        createdAt: identity.createdAt.toISOString(),
      })),
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };
  }
}
