import { Inject, Injectable } from "@nestjs/common";
import { Customer } from "@domain/budgets/entities/customer.entity";
import type { ICustomerRepository } from "@domain/budgets/repositories/customer/i-customer-repository";
import { Result } from "@shared/result";

@Injectable()
export class GetAllCustomersUseCase {
  constructor(
    @Inject("ICustomerRepository")
    private readonly customerRepository: ICustomerRepository,
  ) {}

  async execute(): Promise<Result<Customer[]>> {
    return this.customerRepository.getAll();
  }
}
