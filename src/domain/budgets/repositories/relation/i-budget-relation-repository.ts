import { BudgetCategory } from "@domain/budgets/entities/budget-category.entity";
import { BudgetCategoryLink } from "@domain/budgets/entities/budget-category-link.entity";
import { BudgetLineItem } from "@domain/budgets/entities/budget-line-item.entity";
import { CompanyEvent } from "@domain/budgets/entities/company-event.entity";
import { EventBudget } from "@domain/budgets/entities/event-budget.entity";
import { Result } from "@shared/result";

export interface IBudgetRelationRepository {
  createCompanyEvent(data: CompanyEvent): Promise<Result<CompanyEvent>>;
  createEventBudget(data: EventBudget): Promise<Result<EventBudget>>;
  createBudgetCategoryLink(
    data: BudgetCategoryLink,
  ): Promise<Result<BudgetCategoryLink>>;
  replaceCompanyEvent(data: CompanyEvent): Promise<Result<CompanyEvent>>;
  replaceEventBudget(data: EventBudget): Promise<Result<EventBudget>>;
  replaceBudgetCategoryLinks(
    budgetId: string,
    categories: BudgetCategory[],
  ): Promise<Result<void>>;
  replaceBudgetLineItems(
    budgetId: string,
    items: BudgetLineItem[],
  ): Promise<Result<void>>;
  getCompanyIdByEventId(eventId: string): Promise<Result<string | null>>;
  getEventIdByBudgetId(budgetId: string): Promise<Result<string | null>>;
  getCategoriesByBudgetId(
    budgetId: string,
  ): Promise<Result<BudgetCategory[]>>;
  getLineItemsByBudgetId(budgetId: string): Promise<Result<BudgetLineItem[]>>;
}
