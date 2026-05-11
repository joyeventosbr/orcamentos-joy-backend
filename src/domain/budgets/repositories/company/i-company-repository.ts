import { Company } from "@domain/budgets/entities/company.entity";
import { Result } from "@shared/result";

export interface ICompanyRepository {
  create(data: Company): Promise<Result<Company>>;
  update(data: Company): Promise<Result<Company>>;
  delete(id: string): Promise<Result<void>>;
  getById(id: string): Promise<Result<Company | null>>;
}
