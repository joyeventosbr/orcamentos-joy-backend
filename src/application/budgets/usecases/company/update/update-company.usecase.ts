import { Inject, Injectable } from "@nestjs/common";
import type { ICompanyRepository } from "@domain/budgets/repositories/company/i-company-repository";
import { Result } from "@shared/result";
import { updateCompanySchema } from "./update-company.dto";
import { ZError } from "@utils/index";

@Injectable()
export class UpdateCompanyUseCase {
  constructor(
    @Inject("ICompanyRepository")
    private readonly companyRepository: ICompanyRepository,
  ) {}

  async execute(input: unknown) {
    const parsed = updateCompanySchema.safeParse(input);
    if (!parsed.success) {
      const errors = ZError.create(parsed.error).errors;
      return Result.failure(errors[0] ?? "Dados inválidos");
    }

    const current = await this.companyRepository.getById(parsed.data.id);
    if (current.isFailure()) return Result.failure(current.getError());

    const company = current.getValue();
    if (!company) return Result.failure("Empresa não encontrada");

    company.name = parsed.data.name;
    company.updatedAt = new Date();

    return this.companyRepository.update(company);
  }
}
