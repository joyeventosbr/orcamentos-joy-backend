import { Budget } from "@domain/budgets/entities/budget.entity";
import { BudgetLineItem } from "@domain/budgets/entities/budget-line-item.entity";
import { Result } from "@shared/result";

export interface IBudgetRepository {
  create(data: Budget): Promise<Result<Budget>>;
  update(data: Budget, items?: BudgetLineItem[]): Promise<Result<Budget>>;
  delete(id: string): Promise<Result<void>>;
  getById(id: string): Promise<Result<Budget | null>>;
  getAll(): Promise<Result<Budget[]>>;
}
