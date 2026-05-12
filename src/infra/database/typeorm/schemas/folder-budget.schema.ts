import { Entity, Index, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { FolderSchema } from "./folder.schema";
import { BudgetSchema } from "./budget.schema";

@Entity("tb_folders_budgets")
@Index("UQ_tb_folders_budgets_budget_id", ["budgetId"], { unique: true })
export class FolderBudgetSchema {
  @PrimaryColumn({ name: "folder_id" })
  folderId!: string;

  @PrimaryColumn({ name: "budget_id" })
  budgetId!: string;

  @ManyToOne(() => FolderSchema, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "folder_id" })
  folder!: FolderSchema;

  @ManyToOne(() => BudgetSchema, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "budget_id" })
  budget!: BudgetSchema;
}
