import { Budget } from "@domain/budgets/entities/budget.entity";
import { BudgetDetailResponseDto } from "@domain/budgets/dtos/budget-detail/budget-detail-response.dto";
import { Result } from "@shared/result";

export interface IBudgetRepository {
  create(data: Budget): Promise<Result<Budget>>;
  update(data: Budget): Promise<Result<Budget>>;
  updateAudit(data: Budget): Promise<Result<Budget>>;
  delete(id: string): Promise<Result<void>>;
  getById(id: string): Promise<Result<Budget | null>>;
  getByIdWithLines(id: string): Promise<Result<BudgetDetailResponseDto | null>>;
  getMaxVersionByRootId(rootId: string): Promise<Result<number>>;
  getAll(): Promise<Result<Budget[]>>;
}
