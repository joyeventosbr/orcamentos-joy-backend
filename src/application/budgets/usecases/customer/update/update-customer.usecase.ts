import { Inject, Injectable } from "@nestjs/common";
import { Customer } from "@domain/budgets/entities/customer.entity";
import type { ICustomerRepository } from "@domain/budgets/repositories/customer/i-customer-repository";
import { Result } from "@shared/result";
import { updateCustomerSchema } from "./update-customer.dto";
import { ZError } from "@utils/index";

@Injectable()
export class UpdateCustomerUseCase {
  constructor(
    @Inject("ICustomerRepository")
    private readonly customerRepository: ICustomerRepository,
  ) {}

  async execute(input: unknown): Promise<Result<Customer>> {
    const parsed = updateCustomerSchema.safeParse(input);
    if (!parsed.success) {
      const errors = ZError.create(parsed.error).errors;
      return Result.failure(errors[0] ?? "Dados inválidos");
    }

    const current = await this.customerRepository.getById(parsed.data.id);
    if (current.isFailure()) return Result.failure(current.getError());

    const customer = current.getValue();
    if (!customer) return Result.failure("Cliente não encontrado");

    customer.name = parsed.data.name;
    customer.updatedAt = new Date();

    return this.customerRepository.update(customer);
  }
}
