import { Inject, Injectable } from "@nestjs/common";
import { Result } from "@shared/result";
import type { IBudgetRepository } from "@domain/budgets/repositories/i-budget-repository";
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

    const current = await this.budgetRepository.getById(parsed.data.id);
    if (current.isFailure()) return Result.failure(current.getError());

    const budget = current.getValue();
    if (!budget) return Result.failure("Orçamento não encontrado");

    if (budget.version !== 0 || budget.parentId) {
      return Result.failure(
        "Não é possível deletar pois há mais orçamentos vinculados a ele",
      );
    }

    const hasChildren = await this.budgetRepository.hasChildren(budget.id);
    if (hasChildren.isFailure()) return Result.failure(hasChildren.getError());

    if (hasChildren.getValue()) {
      return Result.failure(
        "Não é possível deletar pois há mais orçamentos vinculados a ele",
      );
    }

    return this.budgetRepository.delete(parsed.data.id);
  }
}
