import { Inject, Injectable } from "@nestjs/common";
import type { IBudgetCategoryRepository } from "@domain/budgets/repositories/i-budget-category-repository";
import { BudgetCategory } from "@domain/budgets/entities/budget-category.entity";
import { Result } from "@shared/result";
import { createCategorySchema } from "./create-category.dto";
import { ZError } from "@utils/index";

@Injectable()
export class CreateCategoryUseCase {
  constructor(
    @Inject("IBudgetCategoryRepository")
    private readonly budgetCategoryRepository: IBudgetCategoryRepository,
  ) {}

  async execute(input: unknown): Promise<Result<BudgetCategory>> {
    const parsed = createCategorySchema.safeParse(input);
    if (!parsed.success) {
      const errors = ZError.create(parsed.error).errors;
      return Result.failure(errors[0] ?? "Dados inválidos");
    }

    const categoryResult = BudgetCategory.create({
      name: parsed.data.name,
      code: parsed.data.code,
      order: parsed.data.order,
    });
    if (categoryResult.isFailure()) {
      return Result.failure(categoryResult.getError());
    }

    return this.budgetCategoryRepository.create(categoryResult.getValue());
  }
}
