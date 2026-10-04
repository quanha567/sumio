import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn, UpdateDateColumn } from "typeorm";

import type { UserOrmEntity } from "./user.orm-entity.js";

@Entity("user_settings")
export class UserSettingsOrmEntity {
  @PrimaryColumn("uuid")
  userId!: string;

  @Column({ type: "varchar", length: 3, default: "USD" })
  baseCurrency!: string;

  @Column({ type: "varchar", length: 20, default: "en-US" })
  locale!: string;

  @Column({ type: "varchar", length: 50, default: "mint" })
  theme!: string;

  @Column({ type: "smallint", default: 1 })
  weekStartsOn!: number;

  @UpdateDateColumn({ type: "timestamptz" })
  updatedAt!: Date;

  @OneToOne("UserOrmEntity", "settings", { onDelete: "CASCADE" })
  @JoinColumn({ name: "userId" })
  user?: UserOrmEntity;
}
