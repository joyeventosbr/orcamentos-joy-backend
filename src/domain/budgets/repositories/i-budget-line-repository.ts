import { BudgetLine } from "@domain/budgets/entities/budget-line.entity";
import { Result } from "@shared/result";

export interface IBudgetLineRepository {
  create(data: BudgetLine): Promise<Result<BudgetLine>>;
  update(data: BudgetLine): Promise<Result<BudgetLine>>;
  delete(id: string): Promise<Result<void>>;
  getById(id: string): Promise<Result<BudgetLine | null>>;
  getAllByBudgetId(budgetId: string): Promise<Result<BudgetLine[]>>;
}
