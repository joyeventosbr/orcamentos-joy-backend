import { Inject, Injectable } from "@nestjs/common";
import type { ICustomerRepository } from "@domain/customers/repositories/i-customer-repository";
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

    const deleted = await this.customerRepository.delete(parsed.data.id);
    if (deleted.isFailure()) {
      return Result.failure(deleted.getError());
    }

    return Result.success(undefined);
  }
}
