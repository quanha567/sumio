import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from "typeorm";

import type { UserOrmEntity } from "./user.orm-entity.js";

@Entity("user_identities")
export class UserIdentityOrmEntity {
  @PrimaryColumn("uuid")
  id!: string;

  @Column("uuid")
  @Index()
  userId!: string;

  @Column({ type: "varchar", length: 50 })
  provider!: string;

  @Column({ type: "varchar", length: 255, unique: true })
  @Index()
  providerUid!: string;

  @Column({ type: "jsonb", default: {} })
  claims!: Record<string, unknown>;

  @Column({ type: "timestamptz", nullable: true })
  lastSignInAt!: Date | null;

  @CreateDateColumn({ type: "timestamptz" })
  createdAt!: Date;

  @ManyToOne("UserOrmEntity", "identities", { onDelete: "CASCADE" })
  @JoinColumn({ name: "userId" })
  user?: UserOrmEntity;
}
