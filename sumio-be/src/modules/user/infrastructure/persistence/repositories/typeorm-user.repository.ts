import { Inject, Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";

import { User } from "../../../domain/entities/user.entity.js";
import { IUserRepository } from "../../../domain/repositories/user.repository.interface.js";
import { Email } from "../../../domain/value-objects/email.vo.js";
import { UserId } from "../../../domain/value-objects/user-id.vo.js";
import { UserIdentityOrmEntity } from "../entities/user-identity.orm-entity.js";
import { UserOrmEntity } from "../entities/user.orm-entity.js";
import { UserMapper } from "../mappers/user.mapper.js";

@Injectable()
export class TypeOrmUserRepository implements IUserRepository {
  constructor(@Inject(DataSource) private readonly dataSource: DataSource) {}

  private async ensureInitialized(): Promise<void> {
    if (!this.dataSource.isInitialized) {
      await this.dataSource.initialize();
    }
  }

  public async findById(id: UserId): Promise<User | null> {
    await this.ensureInitialized();
    const repo = this.dataSource.getRepository(UserOrmEntity);
    const orm = await repo.findOne({
      where: { id: id.value },
      relations: ["identities", "settings"],
    });

    if (!orm) return null;
    return UserMapper.toDomain(orm);
  }

  public async findByFirebaseUid(firebaseUid: string): Promise<User | null> {
    await this.ensureInitialized();
    const repo = this.dataSource.getRepository(UserIdentityOrmEntity);
    const identity = await repo.findOne({
      where: { provider: "firebase", providerUid: firebaseUid },
      relations: ["user", "user.identities", "user.settings"],
    });

    if (!identity?.user) return null;
    return UserMapper.toDomain(identity.user);
  }

  public async findByEmail(email: Email): Promise<User | null> {
    await this.ensureInitialized();
    const repo = this.dataSource.getRepository(UserOrmEntity);
    const orm = await repo.findOne({
      where: { email: email.value },
      relations: ["identities", "settings"],
    });

    if (!orm) return null;
    return UserMapper.toDomain(orm);
  }

  public async save(user: User): Promise<void> {
    await this.ensureInitialized();
    const repo = this.dataSource.getRepository(UserOrmEntity);
    const orm = UserMapper.toOrm(user);
    await repo.save(orm);
  }
}
