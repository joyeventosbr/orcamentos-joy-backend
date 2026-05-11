import { BudgetCategory } from "@domain/budgets/entities/budget-category.entity";
import { Result } from "@shared/result";

export interface IBudgetCategoryRepository {
  create(data: BudgetCategory): Promise<Result<BudgetCategory>>;
  update(data: BudgetCategory): Promise<Result<BudgetCategory>>;
  delete(id: string): Promise<Result<void>>;
}
