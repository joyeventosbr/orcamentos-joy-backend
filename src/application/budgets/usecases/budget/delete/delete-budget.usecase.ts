import { Inject, Injectable } from "@nestjs/common";
import { Result } from "@shared/result";
import type { IBudgetRepository } from "@domain/budgets/repositories/budget/i-budget-repository";
import { deleteBudgetSchema } from "./delete-budget.dto";
import { ZError } from "@utils/index";

@Injectable()
export class DeleteBudgetUseCase {
  constructor(
    @Inject("IBudgetRepository")
    private readonly budgetRepository: IBudgetRepository,
  ) {}

  async execute(input: unknown): Promise<Result<void>> {
    const parsed = deleteBudgetSchema.safeParse(input);

    if (!parsed.success) {
      const errors = ZError.create(parsed.error).errors;
      return Result.failure(errors[0] ?? "Dados inválidos");
    }

    return this.budgetRepository.delete(parsed.data.id);
  }
}
