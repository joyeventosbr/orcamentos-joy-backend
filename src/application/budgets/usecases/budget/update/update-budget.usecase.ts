import { Inject, Injectable } from "@nestjs/common";
import { Result } from "@shared/result";
import { Budget } from "@domain/budgets/entities/budget.entity";
import type { IBudgetRepository } from "@domain/budgets/repositories/i-budget-repository";
import { updateBudgetSchema } from "./update-budget.dto";
import { ZError } from "@utils/index";

@Injectable()
export class UpdateBudgetUseCase {
  constructor(
    @Inject("IBudgetRepository")
    private readonly budgetRepository: IBudgetRepository,
  ) {}

  async execute(input: unknown): Promise<Result<Budget>> {
    const parsed = updateBudgetSchema.safeParse(input);

    if (!parsed.success) {
      const errors = ZError.create(parsed.error).errors;
      return Result.failure(errors[0] ?? "Dados inválidos");
    }

    const current = await this.budgetRepository.getById(parsed.data.id);
    if (current.isFailure()) return Result.failure(current.getError());
    const budget = current.getValue();
    if (!budget) return Result.failure("Orçamento não encontrado");

    const budgetResult = budget.update({
      customerId: parsed.data.customerId,
      folderId: parsed.data.folderId,
      jobDescription: parsed.data.jobDescription,
      location: parsed.data.location,
      eventDate: parsed.data.eventDate,
      paymentTerm: parsed.data.paymentTerm,
    });
    if (budgetResult.isFailure()) {
      return Result.failure(budgetResult.getError());
    }

    return this.budgetRepository.update(budgetResult.getValue());
  }
}
