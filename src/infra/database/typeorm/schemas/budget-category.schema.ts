import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { BudgetSchema } from "./budget.schema";

@Entity("tb_budget_categories")
export class BudgetCategorySchema {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: "budget_id" })
  budgetId: string;

  @ManyToOne(() => BudgetSchema, (budget) => budget.categories, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "budget_id" })
  budget: BudgetSchema;

  @Column()
  name: string;

  @Column()
  code: string;

  @Column({ name: "order_index", type: "int" })
  order: number;
}
