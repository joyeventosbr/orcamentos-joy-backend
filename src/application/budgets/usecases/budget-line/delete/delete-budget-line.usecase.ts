import { Inject, Injectable } from "@nestjs/common";
import type { IBudgetLineRepository } from "@domain/budgets/repositories/i-budget-line-repository";
import type { IBudgetRepository } from "@domain/budgets/repositories/i-budget-repository";
import { Result } from "@shared/result";
import { ZError } from "@utils/index";
import { deleteBudgetLineSchema } from "./delete-budget-line.dto";

@Injectable()
export class DeleteBudgetLineUseCase {
  constructor(
    @Inject("IBudgetLineRepository")
    private readonly budgetLineRepository: IBudgetLineRepository,
    @Inject("IBudgetRepository")
    private readonly budgetRepository: IBudgetRepository,
  ) {}

  async execute(input: unknown): Promise<Result<void>> {
    const parsed = deleteBudgetLineSchema.safeParse(input);

    if (!parsed.success) {
      const errors = ZError.create(parsed.error).errors;
      return Result.failure(errors[0] ?? "Dados inválidos");
    }

    const current = await this.budgetLineRepository.getById(parsed.data.id);
    if (current.isFailure()) return Result.failure(current.getError());
    const line = current.getValue();
    if (!line) return Result.failure("Linha do orçamento não encontrada");

    const deleted = await this.budgetLineRepository.delete(parsed.data.id);
    if (deleted.isFailure()) return Result.failure(deleted.getError());

    const budgetId = line.budgetId;
    const updatedBy = parsed.data.updatedBy;
    const budgetResult = await this.budgetRepository.getById(budgetId);
    if (budgetResult.isFailure()) {
      return Result.failure(budgetResult.getError());
    }

    const budget = budgetResult.getValue();
    if (!budget) return Result.failure("Orçamento não encontrado");

    const updated = budget.markUpdatedBy(updatedBy);
    if (updated.isFailure()) return Result.failure(updated.getError());

    const saved = await this.budgetRepository.updateAudit(updated.getValue());
    if (saved.isFailure()) return Result.failure(saved.getError());

    return deleted;
  }
}
