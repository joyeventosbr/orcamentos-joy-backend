import { BudgetLineItem } from "@domain/budgets/entities/budget-line-item.entity";
import { CustomerFolder } from "@domain/folders/entities/customer-folder.entity";
import { FolderBudget } from "@domain/budgets/entities/folder-budget.entity";
import { Result } from "@shared/result";

export interface IBudgetRelationRepository {
  createCustomerFolder(data: CustomerFolder): Promise<Result<CustomerFolder>>;
  createFolderBudget(data: FolderBudget): Promise<Result<FolderBudget>>;
  replaceCustomerFolder(data: CustomerFolder): Promise<Result<CustomerFolder>>;
  replaceFolderBudget(data: FolderBudget): Promise<Result<FolderBudget>>;
  replaceBudgetLineItems(
    budgetId: string,
    items: BudgetLineItem[],
  ): Promise<Result<void>>;
  getCustomerIdByFolderId(folderId: string): Promise<Result<string | null>>;
  getFolderIdByBudgetId(budgetId: string): Promise<Result<string | null>>;
  getLineItemsByBudgetId(budgetId: string): Promise<Result<BudgetLineItem[]>>;
}
