import { Budget } from "@domain/budgets/entities/budget.entity";
import { Event } from "@domain/budgets/entities/event.entity";
import { BudgetCategory } from "@domain/budgets/entities/budget-category.entity";
import { Result } from "@shared/result";

export interface IBudgetRepository {
  create(data: Budget): Promise<Result<Budget>>;
  update(data: Budget): Promise<Result<Budget>>;
  delete(id: string): Promise<Result<void>>;
  getById(id: string): Promise<Result<Budget | null>>;
  createEvent(data: Event): Promise<Result<Event>>;
  updateEvent(data: Event): Promise<Result<Event>>;
  deleteEvent(id: string): Promise<Result<void>>;
  getEventById(id: string): Promise<Result<Event | null>>;
  createCategory(data: BudgetCategory): Promise<Result<BudgetCategory>>;
  updateCategory(data: BudgetCategory): Promise<Result<BudgetCategory>>;
  deleteCategory(id: string): Promise<Result<void>>;
}
