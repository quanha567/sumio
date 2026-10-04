import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import type { UpdateUserSettingsDto, UserSettingsDto } from "@sumio/contract";

import { IUseCase } from "../../../../../shared/application/use-case.interface.js";
import {
  type IUserRepository,
  USER_REPOSITORY,
} from "../../../domain/repositories/user.repository.interface.js";
import { Currency } from "../../../domain/value-objects/currency.vo.js";
import { UserId } from "../../../domain/value-objects/user-id.vo.js";

export interface UpdateSettingsInput {
  userId: string;
  dto: UpdateUserSettingsDto;
}

@Injectable()
export class UpdateSettingsUseCase implements IUseCase<UpdateSettingsInput, UserSettingsDto> {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  public async execute(input: UpdateSettingsInput): Promise<UserSettingsDto> {
    const userId = UserId.create(input.userId);
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new NotFoundException(`User with id ${input.userId} was not found.`);
    }

    user.updateSettings({
      baseCurrency: input.dto.baseCurrency ? Currency.create(input.dto.baseCurrency) : undefined,
      locale: input.dto.locale,
      theme: input.dto.theme,
      weekStartsOn: input.dto.weekStartsOn,
    });

    await this.userRepository.save(user);

    return {
      baseCurrency: user.settings.baseCurrency.code,
      locale: user.settings.locale,
      theme: user.settings.theme,
      weekStartsOn: user.settings.weekStartsOn,
      updatedAt: user.settings.updatedAt.toISOString(),
    };
  }
}
