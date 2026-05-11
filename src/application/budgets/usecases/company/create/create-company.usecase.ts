import { Inject, Injectable } from "@nestjs/common";
import type { IBudgetRepository } from "@domain/budgets/repositories/i-budget-repository";
import { Company } from "@domain/budgets/entities/company.entity";
import { Result } from "@shared/result";
import { createCompanySchema } from "./create-company.dto";
import { ZError } from "@utils/index";

@Injectable()
export class CreateCompanyUseCase {
  constructor(
    @Inject("IBudgetRepository")
    private readonly budgetRepository: IBudgetRepository,
  ) {}

  async execute(input: unknown) {
    const parsed = createCompanySchema.safeParse(input);
    if (!parsed.success) {
      const errors = ZError.create(parsed.error).errors;
      return Result.failure(errors[0] ?? "Dados inválidos");
    }

    const company = new Company("", parsed.data.name, new Date());
    return this.budgetRepository.createCompany(company);
  }
}
