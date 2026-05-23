import { Category } from "@domain/budgets/entities/category.entity";
import { Result } from "@shared/result";

export interface ICategoryRepository {
  create(data: Category): Promise<Result<Category>>;
  update(data: Category): Promise<Result<Category>>;
  delete(id: string): Promise<Result<void>>;
  getById(id: string): Promise<Result<Category | null>>;
  getByCode(code: string): Promise<Result<Category | null>>;
  getAll(): Promise<Result<Category[]>>;
}
