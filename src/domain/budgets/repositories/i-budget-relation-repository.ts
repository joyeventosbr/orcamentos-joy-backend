import { CustomerFolder } from "@domain/folders/entities/customer-folder.entity";
import { FolderBudget } from "@domain/budgets/entities/folder-budget.entity";
import { Result } from "@shared/result";

export interface IBudgetRelationRepository {
  createCustomerFolder(data: CustomerFolder): Promise<Result<CustomerFolder>>;
  createFolderBudget(data: FolderBudget): Promise<Result<FolderBudget>>;
  replaceCustomerFolder(data: CustomerFolder): Promise<Result<CustomerFolder>>;
  replaceFolderBudget(data: FolderBudget): Promise<Result<FolderBudget>>;
  getCustomerIdByFolderId(folderId: string): Promise<Result<string | null>>;
  getFolderIdByBudgetId(budgetId: string): Promise<Result<string | null>>;
}
