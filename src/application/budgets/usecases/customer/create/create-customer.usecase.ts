import { Inject, Injectable } from "@nestjs/common";
import type { ICustomerRepository } from "@domain/budgets/repositories/customer/i-customer-repository";
import { Customer } from "@domain/budgets/entities/customer.entity";
import { Result } from "@shared/result";
import { createCustomerSchema } from "./create-customer.dto";
import { ZError } from "@utils/index";

@Injectable()
export class CreateCustomerUseCase {
  constructor(
    @Inject("ICustomerRepository")
    private readonly customerRepository: ICustomerRepository,
  ) {}

  async execute(input: unknown): Promise<Result<Customer>> {
    const parsed = createCustomerSchema.safeParse(input);
    if (!parsed.success) {
      const errors = ZError.create(parsed.error).errors;
      return Result.failure(errors[0] ?? "Dados inválidos");
    }

    const customerResult = Customer.create({ name: parsed.data.name });
    if (customerResult.isFailure()) {
      return Result.failure(customerResult.getError());
    }

    return await this.customerRepository.create(customerResult.getValue());
  }
}
