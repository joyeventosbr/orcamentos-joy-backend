import { Inject, Injectable } from "@nestjs/common";
import type { ICustomerRepository } from "@domain/budgets/repositories/customer/i-customer-repository";
import { Result } from "@shared/result";
import { deleteCustomerSchema } from "./delete-customer.dto";
import { ZError } from "@utils/index";

@Injectable()
export class DeleteCustomerUseCase {
  constructor(
    @Inject("ICustomerRepository")
    private readonly customerRepository: ICustomerRepository,
  ) {}

  async execute(input: unknown): Promise<Result<void>> {
    const parsed = deleteCustomerSchema.safeParse(input);
    if (!parsed.success) {
      const errors = ZError.create(parsed.error).errors;
      return Result.failure(errors[0] ?? "Dados inválidos");
    }

    return this.customerRepository.delete(parsed.data.id);
  }
}
