import { Budget } from "@domain/budgets/entities/budget.entity";
import { BudgetDetailResponseDto } from "@domain/budgets/dtos/budget-detail/budget-detail-response.dto";
import { BudgetListItemResponseDto } from "@domain/budgets/dtos/budget-list/budget-list-item-response.dto";
import { Result } from "@shared/result";

export interface IBudgetRepository {
  create(data: Budget): Promise<Result<Budget>>;
  update(data: Budget): Promise<Result<Budget>>;
  updateAudit(data: Budget): Promise<Result<Budget>>;
  delete(id: string): Promise<Result<void>>;
  getById(id: string): Promise<Result<Budget | null>>;
  getByIdForRead(id: string): Promise<Result<BudgetListItemResponseDto | null>>;
  getByIdWithLines(id: string): Promise<Result<BudgetDetailResponseDto | null>>;
  getMaxVersionByRootId(rootId: string): Promise<Result<number>>;
  hasChildren(id: string): Promise<Result<boolean>>;
  getAll(): Promise<Result<BudgetListItemResponseDto[]>>;
}
