import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";

import { UserIdentityOrmEntity } from "./user-identity.orm-entity.js";
import { UserSettingsOrmEntity } from "./user-settings.orm-entity.js";

@Entity("users")
export class UserOrmEntity {
  @PrimaryColumn("uuid")
  id!: string;

  @Column({ type: "varchar", length: 255, unique: true })
  @Index()
  email!: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  displayName!: string | null;

  @Column({ type: "text", nullable: true })
  photoUrl!: string | null;

  @Column({ type: "varchar", length: 20, default: "ACTIVE" })
  status!: string;

  @CreateDateColumn({ type: "timestamptz" })
  createdAt!: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  updatedAt!: Date;

  @OneToMany(() => UserIdentityOrmEntity, (identity) => identity.user, {
    cascade: true,
    eager: true,
  })
  identities!: UserIdentityOrmEntity[];

  @OneToOne(() => UserSettingsOrmEntity, (settings) => settings.user, {
    cascade: true,
    eager: true,
  })
  settings!: UserSettingsOrmEntity;
}
