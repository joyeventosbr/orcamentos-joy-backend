import { Customer } from "@domain/budgets/entities/customer.entity";
import { Result } from "@shared/result";

export interface ICustomerRepository {
  create(data: Customer): Promise<Result<Customer>>;
  update(data: Customer): Promise<Result<Customer>>;
  delete(id: string): Promise<Result<void>>;
  getById(id: string): Promise<Result<Customer | null>>;
  getAll(): Promise<Result<Customer[]>>;
}
