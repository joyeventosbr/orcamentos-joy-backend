import { Budget } from "@domain/budgets/entities/budget.entity";
import { BudgetLine } from "@domain/budgets/entities/budget-line.entity";
import { Result } from "@shared/result";

export interface IBudgetRepository {
  create(data: Budget, lines?: BudgetLine[]): Promise<Result<Budget>>;
  update(data: Budget): Promise<Result<Budget>>;
  delete(id: string): Promise<Result<void>>;
  getById(id: string): Promise<Result<Budget | null>>;
  getAll(): Promise<Result<Budget[]>>;
}
