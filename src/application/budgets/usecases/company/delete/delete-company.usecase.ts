import { Inject, Injectable } from "@nestjs/common";
import type { ICompanyRepository } from "@domain/budgets/repositories/company/i-company-repository";
import { Result } from "@shared/result";
import { deleteCompanySchema } from "./delete-company.dto";
import { ZError } from "@utils/index";

@Injectable()
export class DeleteCompanyUseCase {
  constructor(
    @Inject("ICompanyRepository")
    private readonly companyRepository: ICompanyRepository,
  ) {}

  async execute(input: unknown) {
    const parsed = deleteCompanySchema.safeParse(input);
    if (!parsed.success) {
      const errors = ZError.create(parsed.error).errors;
      return Result.failure(errors[0] ?? "Dados inválidos");
    }

    return this.companyRepository.delete(parsed.data.id);
  }
}
