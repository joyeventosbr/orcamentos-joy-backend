import { Inject, Injectable } from "@nestjs/common";
import type { IBudgetLineRepository } from "@domain/budgets/repositories/i-budget-line-repository";
import { Result } from "@shared/result";
import { ZError } from "@utils/index";
import { deleteBudgetLineSchema } from "./delete-budget-line.dto";

@Injectable()
export class DeleteBudgetLineUseCase {
  constructor(
    @Inject("IBudgetLineRepository")
    private readonly budgetLineRepository: IBudgetLineRepository,
  ) {}

  async execute(input: unknown): Promise<Result<void>> {
    const parsed = deleteBudgetLineSchema.safeParse(input);

    if (!parsed.success) {
      const errors = ZError.create(parsed.error).errors;
      return Result.failure(errors[0] ?? "Dados inválidos");
    }

    const current = await this.budgetLineRepository.getById(parsed.data.id);
    if (current.isFailure()) return Result.failure(current.getError());
    if (!current.getValue())
      return Result.failure("Linha do orçamento não encontrada");

    return this.budgetLineRepository.delete(parsed.data.id);
  }
}
