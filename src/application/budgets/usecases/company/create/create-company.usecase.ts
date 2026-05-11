import { Inject, Injectable } from "@nestjs/common";
import type { ICompanyRepository } from "@domain/budgets/repositories/company/i-company-repository";
import { Company } from "@domain/budgets/entities/company.entity";
import { Result } from "@shared/result";
import { createCompanySchema } from "./create-company.dto";
import { ZError } from "@utils/index";

@Injectable()
export class CreateCompanyUseCase {
  constructor(
    @Inject("ICompanyRepository")
    private readonly companyRepository: ICompanyRepository,
  ) {}

  async execute(input: unknown) {
    const parsed = createCompanySchema.safeParse(input);
    if (!parsed.success) {
      const errors = ZError.create(parsed.error).errors;
      return Result.failure(errors[0] ?? "Dados inválidos");
    }

    const company = new Company("", parsed.data.name, new Date());
    return this.companyRepository.create(company);
  }
}
