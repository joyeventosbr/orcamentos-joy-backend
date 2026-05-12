import { BudgetCategory } from "@domain/budgets/entities/budget-category.entity";
import { BudgetCategoryLink } from "@domain/budgets/entities/budget-category-link.entity";
import { BudgetLineItem } from "@domain/budgets/entities/budget-line-item.entity";
import { CustomerFolder } from "@domain/budgets/entities/customer-folder.entity";
import { FolderBudget } from "@domain/budgets/entities/folder-budget.entity";
import { Result } from "@shared/result";

export interface IBudgetRelationRepository {
  createCustomerFolder(data: CustomerFolder): Promise<Result<CustomerFolder>>;
  createFolderBudget(data: FolderBudget): Promise<Result<FolderBudget>>;
  createBudgetCategoryLink(
    data: BudgetCategoryLink,
  ): Promise<Result<BudgetCategoryLink>>;
  replaceCustomerFolder(data: CustomerFolder): Promise<Result<CustomerFolder>>;
  replaceFolderBudget(data: FolderBudget): Promise<Result<FolderBudget>>;
  replaceBudgetCategoryLinks(
    budgetId: string,
    categories: BudgetCategory[],
  ): Promise<Result<void>>;
  replaceBudgetLineItems(
    budgetId: string,
    items: BudgetLineItem[],
  ): Promise<Result<void>>;
  getCustomerIdByFolderId(folderId: string): Promise<Result<string | null>>;
  getFolderIdByBudgetId(budgetId: string): Promise<Result<string | null>>;
  getCategoriesByBudgetId(
    budgetId: string,
  ): Promise<Result<BudgetCategory[]>>;
  getLineItemsByBudgetId(budgetId: string): Promise<Result<BudgetLineItem[]>>;
}
