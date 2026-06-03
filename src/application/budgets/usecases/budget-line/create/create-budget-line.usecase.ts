import { Inject, Injectable } from "@nestjs/common";
import { BudgetLine } from "@domain/budgets/entities/budget-line.entity";
import type { IBudgetLineRepository } from "@domain/budgets/repositories/i-budget-line-repository";
import type { IBudgetRepository } from "@domain/budgets/repositories/i-budget-repository";
import { Result } from "@shared/result";
import { ZError } from "@utils/index";
import { createBudgetLineSchema } from "./create-budget-line.dto";

@Injectable()
export class CreateBudgetLineUseCase {
  constructor(
    @Inject("IBudgetLineRepository")
    private readonly budgetLineRepository: IBudgetLineRepository,
    @Inject("IBudgetRepository")
    private readonly budgetRepository: IBudgetRepository,
  ) {}

  async execute(input: unknown): Promise<Result<BudgetLine>> {
    const parsed = createBudgetLineSchema.safeParse(input);

    if (!parsed.success) {
      const errors = ZError.create(parsed.error).errors;
      return Result.failure(errors[0] ?? "Dados inválidos");
    }

    const lineResult = BudgetLine.create(parsed.data);
    if (lineResult.isFailure()) return Result.failure(lineResult.getError());

    const created = await this.budgetLineRepository.create(
      lineResult.getValue(),
    );
    if (created.isFailure()) return Result.failure(created.getError());

    const budgetId = created.getValue().budgetId;
    const updatedBy = parsed.data.updatedBy;
    const budgetResult = await this.budgetRepository.getById(budgetId);
    if (budgetResult.isFailure())
      return Result.failure(budgetResult.getError());

    const budget = budgetResult.getValue();
    if (!budget) return Result.failure("Orçamento não encontrado");

    const updated = budget.markUpdatedBy(updatedBy);
    if (updated.isFailure()) {
      return Result.failure(updated.getError());
    }

    const saved = await this.budgetRepository.updateAudit(budget);
    if (saved.isFailure()) {
      return Result.failure(`${saved.getError()}`);
    }

    return created;
  }
}
