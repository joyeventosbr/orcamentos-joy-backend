import { Budget } from "@domain/budgets/entities/budget.entity";
import { BudgetDetailResponseDto } from "@application/budgets/dtos/budget-detail/budget-detail-response.dto";
import { Result } from "@shared/result";

export interface IBudgetRepository {
  create(data: Budget): Promise<Result<Budget>>;
  update(data: Budget): Promise<Result<Budget>>;
  delete(id: string): Promise<Result<void>>;
  getById(id: string): Promise<Result<Budget | null>>;
  getByIdWithLines(id: string): Promise<Result<BudgetDetailResponseDto | null>>;
  getAll(): Promise<Result<Budget[]>>;
}
