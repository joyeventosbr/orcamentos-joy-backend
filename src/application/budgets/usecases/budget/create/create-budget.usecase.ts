import { Inject, Injectable } from "@nestjs/common";
import { Result } from "@shared/result";
import { Budget } from "@domain/budgets/entities/budget.entity";
import type { IBudgetRepository } from "@domain/budgets/repositories/i-budget-repository";
import { createBudgetSchema } from "./create-budget.dto";
import { ZError } from "@utils/index";
import { DefaultBudgetLinesFactory } from "@application/budgets/factories/default-budget-lines.factory";

@Injectable()
export class CreateBudgetUseCase {
  constructor(
    @Inject("IBudgetRepository")
    private readonly budgetRepository: IBudgetRepository,
  ) {}

  async execute(input: unknown): Promise<Result<Budget>> {
    const parsed = createBudgetSchema.safeParse(input);

    if (!parsed.success) {
      const errors = ZError.create(parsed.error).errors;
      return Result.failure(errors[0] ?? "Dados inválidos");
    }

    const budgetResult = Budget.create({
      name: parsed.data.name,
      customerId: parsed.data.customerId,
      folderId: parsed.data.folderId,
    });
    if (budgetResult.isFailure()) {
      return Result.failure(budgetResult.getError());
    }

    const budget = budgetResult.getValue();
    const linesResult = DefaultBudgetLinesFactory.create(budget.id);
    if (linesResult.isFailure()) {
      return Result.failure(linesResult.getError());
    }

    return this.budgetRepository.create(budget, linesResult.getValue());
  }
}
