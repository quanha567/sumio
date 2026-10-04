import { UserIdentity } from "../../../domain/entities/user-identity.entity.js";
import { UserSettings } from "../../../domain/entities/user-settings.entity.js";
import { User, type UserStatus } from "../../../domain/entities/user.entity.js";
import { Currency } from "../../../domain/value-objects/currency.vo.js";
import { Email } from "../../../domain/value-objects/email.vo.js";
import { UserId } from "../../../domain/value-objects/user-id.vo.js";
import { UserIdentityOrmEntity } from "../entities/user-identity.orm-entity.js";
import { UserSettingsOrmEntity } from "../entities/user-settings.orm-entity.js";
import { UserOrmEntity } from "../entities/user.orm-entity.js";

export class UserMapper {
  public static toDomain(orm: UserOrmEntity): User {
    const userId = UserId.create(orm.id);
    const email = Email.create(orm.email);

    const identities = (orm.identities ?? []).map((idOrm: UserIdentityOrmEntity) =>
      UserIdentity.create({
        id: idOrm.id,
        userId: idOrm.userId,
        provider: idOrm.provider,
        providerUid: idOrm.providerUid,
        claims: idOrm.claims ?? {},
        lastSignInAt: idOrm.lastSignInAt,
        createdAt: idOrm.createdAt,
      }),
    );

    const settings = orm.settings
      ? UserSettings.create(userId.value, {
          baseCurrency: Currency.create(orm.settings.baseCurrency),
          locale: orm.settings.locale,
          theme: orm.settings.theme,
          weekStartsOn: orm.settings.weekStartsOn,
          updatedAt: orm.settings.updatedAt,
        })
      : UserSettings.createDefault(userId.value);

    return User.reconstruct(userId, {
      email,
      displayName: orm.displayName,
      photoUrl: orm.photoUrl,
      status: orm.status as UserStatus,
      identities,
      settings,
      createdAt: orm.createdAt,
      updatedAt: orm.updatedAt,
    });
  }

  public static toOrm(domain: User): UserOrmEntity {
    const orm = new UserOrmEntity();
    orm.id = domain.id.value;
    orm.email = domain.email.value;
    orm.displayName = domain.displayName;
    orm.photoUrl = domain.photoUrl;
    orm.status = domain.status;
    orm.createdAt = domain.createdAt;
    orm.updatedAt = domain.updatedAt;

    orm.identities = domain.identities.map((identity: UserIdentity) => {
      const idOrm = new UserIdentityOrmEntity();
      idOrm.id = identity.id;
      idOrm.userId = domain.id.value;
      idOrm.provider = identity.provider;
      idOrm.providerUid = identity.providerUid;
      idOrm.claims = identity.claims;
      idOrm.lastSignInAt = identity.lastSignInAt;
      idOrm.createdAt = identity.createdAt;
      return idOrm;
    });

    const settingsOrm = new UserSettingsOrmEntity();
    settingsOrm.userId = domain.id.value;
    settingsOrm.baseCurrency = domain.settings.baseCurrency.code;
    settingsOrm.locale = domain.settings.locale;
    settingsOrm.theme = domain.settings.theme;
    settingsOrm.weekStartsOn = domain.settings.weekStartsOn;
    settingsOrm.updatedAt = domain.settings.updatedAt;
    orm.settings = settingsOrm;

    return orm;
  }
}
