import { Inject, Injectable } from "@nestjs/common";
import { Budget } from "@domain/budgets/entities/budget.entity";
import type { IBudgetRepository } from "@domain/budgets/repositories/budget/i-budget-repository";
import { Result } from "@shared/result";

@Injectable()
export class GetAllBudgetsUseCase {
  constructor(
    @Inject("IBudgetRepository")
    private readonly budgetRepository: IBudgetRepository,
  ) {}

  async execute(): Promise<Result<Budget[]>> {
    return this.budgetRepository.getAll();
  }
}
