import { Inject, Injectable } from "@nestjs/common";
import { BudgetLine } from "@domain/budgets/entities/budget-line.entity";
import type { IBudgetLineRepository } from "@domain/budgets/repositories/i-budget-line-repository";
import { Result } from "@shared/result";
import { ZError } from "@utils/index";
import { createBudgetLineSchema } from "./create-budget-line.dto";

@Injectable()
export class CreateBudgetLineUseCase {
  constructor(
    @Inject("IBudgetLineRepository")
    private readonly budgetLineRepository: IBudgetLineRepository,
  ) {}

  async execute(input: unknown): Promise<Result<BudgetLine>> {
    const parsed = createBudgetLineSchema.safeParse(input);

    if (!parsed.success) {
      const errors = ZError.create(parsed.error).errors;
      return Result.failure(errors[0] ?? "Dados inválidos");
    }

    const lineResult = BudgetLine.create(parsed.data);
    if (lineResult.isFailure()) return Result.failure(lineResult.getError());

    return this.budgetLineRepository.create(lineResult.getValue());
  }
}
