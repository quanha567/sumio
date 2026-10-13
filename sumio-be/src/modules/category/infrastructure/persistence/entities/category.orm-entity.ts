import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from "typeorm";

import type { UserOrmEntity } from "../../../../user/infrastructure/persistence/entities/user.orm-entity";

@Entity("categories")
@Index("UQ_categories_user_type_name", ["userId", "type", "name"], { unique: true })
export class CategoryOrmEntity {
  @PrimaryColumn("uuid")
  id!: string;

  @Column({ type: "uuid" })
  @Index("IDX_categories_user_id")
  userId!: string;

  @Column({ type: "varchar", length: 100 })
  name!: string;

  @Column({ type: "varchar", length: 10 })
  type!: "income" | "expense";

  @CreateDateColumn({ type: "timestamptz" })
  createdAt!: Date;

  @ManyToOne("UserOrmEntity", { onDelete: "CASCADE" })
  @JoinColumn({ name: "userId" })
  user?: UserOrmEntity;
}
