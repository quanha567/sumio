import { Inject, Injectable } from "@nestjs/common";

import { IUseCase } from "../../../../../shared/application/use-case.interface.js";
import { User } from "../../../domain/entities/user.entity.js";
import {
  type IUserRepository,
  USER_REPOSITORY,
} from "../../../domain/repositories/user.repository.interface.js";
import { Email } from "../../../domain/value-objects/email.vo.js";
import { SyncUserCommand } from "./sync-user.command.js";

@Injectable()
export class SyncUserUseCase implements IUseCase<SyncUserCommand, User> {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  public async execute(command: SyncUserCommand): Promise<User> {
    const claims = command.claims ?? {};

    // 1. Try finding by Firebase UID
    const existingByIdentity = await this.userRepository.findByFirebaseUid(command.firebaseUid);
    if (existingByIdentity) {
      existingByIdentity.linkOrUpdateFirebaseIdentity(command.firebaseUid, claims);
      if (command.displayName || command.photoUrl) {
        existingByIdentity.updateProfile(command.displayName, command.photoUrl);
      }
      await this.userRepository.save(existingByIdentity);
      return existingByIdentity;
    }

    // 2. Try finding by Email (to link accounts if user signed in before)
    const emailVo = Email.create(command.email);
    const existingByEmail = await this.userRepository.findByEmail(emailVo);
    if (existingByEmail) {
      existingByEmail.linkOrUpdateFirebaseIdentity(command.firebaseUid, claims);
      if (command.displayName || command.photoUrl) {
        existingByEmail.updateProfile(command.displayName, command.photoUrl);
      }
      await this.userRepository.save(existingByEmail);
      return existingByEmail;
    }

    // 3. JIT Provision new user
    const newUser = User.create({
      email: emailVo,
      displayName: command.displayName,
      photoUrl: command.photoUrl,
      firebaseUid: command.firebaseUid,
      claims,
    });

    await this.userRepository.save(newUser);
    return newUser;
  }
}
