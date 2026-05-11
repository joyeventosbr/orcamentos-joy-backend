import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { BudgetSchema } from "./budget.schema";
import { BudgetCategorySchema } from "./budget-category.schema";

@Entity("tb_budgets_categories")
export class BudgetCategoryLinkSchema {
  @PrimaryColumn({ name: "budget_id" })
  budgetId!: string;

  @PrimaryColumn({ name: "category_id" })
  categoryId!: string;

  @ManyToOne(() => BudgetSchema, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "budget_id" })
  budget!: BudgetSchema;

  @ManyToOne(() => BudgetCategorySchema, {
    eager: true,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "category_id" })
  category!: BudgetCategorySchema;
}
