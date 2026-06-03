import { Inject, Injectable } from "@nestjs/common";
import { Budget } from "@domain/budgets/entities/budget.entity";
import type { IBudgetRepository } from "@domain/budgets/repositories/i-budget-repository";
import { Result } from "@shared/result";
import { ZError } from "@utils/index";
import { updateBudgetStatusSchema } from "./update-budget-status.dto";

@Injectable()
export class UpdateBudgetStatusUseCase {
  constructor(
    @Inject("IBudgetRepository")
    private readonly budgetRepository: IBudgetRepository,
  ) {}

  async execute(input: unknown): Promise<Result<Budget>> {
    const parsed = updateBudgetStatusSchema.safeParse(input);

    if (!parsed.success) {
      const errors = ZError.create(parsed.error).errors;
      return Result.failure(errors[0] ?? "Dados inválidos");
    }

    const current = await this.budgetRepository.getById(parsed.data.id);
    if (current.isFailure()) return Result.failure(current.getError());

    const budget = current.getValue();
    if (!budget) return Result.failure("Orçamento não encontrado");

    const budgetStatusResult = budget.updateStatus(
      parsed.data.status,
      parsed.data.updatedBy,
    );
    if (budgetStatusResult.isFailure()) {
      return Result.failure(budgetStatusResult.getError());
    }

    return this.budgetRepository.updateStatus(budget);
  }
}
