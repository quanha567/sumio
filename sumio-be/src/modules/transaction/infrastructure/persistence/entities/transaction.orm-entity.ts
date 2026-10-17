import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";

import { CategoryOrmEntity } from "../../../../category/infrastructure/persistence/entities/category.orm-entity";
import type { UserOrmEntity } from "../../../../user/infrastructure/persistence/entities/user.orm-entity";

/** Postgres returns `bigint` as a string; amounts are capped at MAX_SAFE_INTEGER by the contract. */
const bigintToNumber = {
  to: (value: number) => value,
  from: (value: string | null) => (value === null ? value : Number(value)),
};

@Entity("transactions")
@Index("IDX_transactions_user_date", ["userId", "date", "createdAt"])
export class TransactionOrmEntity {
  @PrimaryColumn("uuid")
  id!: string;

  @Column({ type: "uuid" })
  userId!: string;

  @Column({ type: "uuid" })
  @Index("IDX_transactions_category_id")
  categoryId!: string;

  @Column({ type: "varchar", length: 10 })
  type!: "income" | "expense";

  /** Positive integer in the currency's minor unit (ADR 0006). */
  @Column({ type: "bigint", transformer: bigintToNumber })
  amount!: number;

  @Column({ type: "char", length: 3 })
  currency!: string;

  /** `YYYY-MM-DD`, no timezone. */
  @Column({ type: "date" })
  date!: string;

  @Column({ type: "varchar", length: 255, default: "" })
  description!: string;

  @CreateDateColumn({ type: "timestamptz" })
  createdAt!: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  updatedAt!: Date;

  @ManyToOne("UserOrmEntity", { onDelete: "CASCADE" })
  @JoinColumn({ name: "userId" })
  user?: UserOrmEntity;

  /** RESTRICT: a Category in use cannot be deleted. */
  @ManyToOne(() => CategoryOrmEntity, { onDelete: "RESTRICT", eager: true })
  @JoinColumn({ name: "categoryId" })
  category!: CategoryOrmEntity;
}
