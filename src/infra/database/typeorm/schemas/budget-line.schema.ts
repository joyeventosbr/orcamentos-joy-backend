import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { BudgetSchema } from "./budget.schema";
import { CategorySchema } from "./category.schema";

@Entity("tb_budget_lines")
export class BudgetLineSchema {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "budget_id" })
  budgetId!: string;

  @ManyToOne(() => BudgetSchema, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "budget_id" })
  budget!: BudgetSchema;

  @Column({ name: "category_code" })
  categoryCode!: string;

  @ManyToOne(() => CategorySchema, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn({ name: "category_code", referencedColumnName: "code" })
  category!: CategorySchema;

  @Column({ name: "parent_id", nullable: true })
  parentId!: string | null;

  @ManyToOne(() => BudgetLineSchema, {
    onDelete: "SET NULL",
    nullable: true,
  })
  @JoinColumn({ name: "parent_id" })
  parent?: BudgetLineSchema | null;

  @Column({ name: "order", type: "int" })
  order!: number;

  @Column()
  name!: string;

  @Column({ default: "" })
  description!: string;

  @Column({ name: "billing_type" })
  billingType!: string;

  @Column({ type: "float" })
  quantity!: number;

  @Column({ name: "daily_rates", type: "float" })
  dailyRates!: number;

  @Column({ name: "unit_value", type: "float" })
  unitValue!: number;

  @Column({ name: "total_value", type: "float" })
  totalValue!: number;

  @Column({ name: "upfront_payment", type: "float" })
  upfrontPayment!: number;

  @Column({ name: "installment_30_days", type: "float" })
  installment30Days!: number;

  @Column({ name: "installment_45_days", type: "float" })
  installment45Days!: number;

  @Column({ name: "installment_60_days", type: "float" })
  installment60Days!: number;

  @Column({ name: "installment_90_days", type: "float" })
  installment90Days!: number;

  @Column({ name: "installment_120_days", type: "float" })
  installment120Days!: number;

  @Column({ name: "billing_unit_value", type: "float" })
  billingUnitValue!: number;

  @Column({ name: "billing_total_value", type: "float" })
  billingTotalValue!: number;
}
