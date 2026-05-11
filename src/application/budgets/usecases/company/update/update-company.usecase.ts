import { Inject, Injectable } from "@nestjs/common";
import type { IBudgetRepository } from "@domain/budgets/repositories/i-budget-repository";
import { Result } from "@shared/result";
import { updateCompanySchema } from "./update-company.dto";
import { ZError } from "@utils/index";

@Injectable()
export class UpdateCompanyUseCase {
  constructor(
    @Inject("IBudgetRepository")
    private readonly budgetRepository: IBudgetRepository,
  ) {}

  async execute(input: unknown) {
    const parsed = updateCompanySchema.safeParse(input);
    if (!parsed.success) {
      const errors = ZError.create(parsed.error).errors;
      return Result.failure(errors[0] ?? "Dados inválidos");
    }

    const current = await this.budgetRepository.getCompanyById(parsed.data.id);
    if (current.isFailure()) return Result.failure(current.getError());

    const company = current.getValue();
    if (!company) return Result.failure("Empresa não encontrada");

    company.name = parsed.data.name;
    company.updatedAt = new Date();

    return this.budgetRepository.updateCompany(company);
  }
}
