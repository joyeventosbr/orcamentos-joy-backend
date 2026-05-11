import { Inject, Injectable } from "@nestjs/common";
import type { IBudgetCategoryRepository } from "@domain/budgets/repositories/category/i-budget-category-repository";
import { BudgetCategory } from "@domain/budgets/entities/budget-category.entity";
import { Result } from "@shared/result";
import { updateCategorySchema } from "./update-category.dto";
import { ZError } from "@utils/index";

@Injectable()
export class UpdateCategoryUseCase {
  constructor(
    @Inject("IBudgetCategoryRepository")
    private readonly budgetCategoryRepository: IBudgetCategoryRepository,
  ) {}

  async execute(input: unknown) {
    const parsed = updateCategorySchema.safeParse(input);
    if (!parsed.success) {
      const errors = ZError.create(parsed.error).errors;
      return Result.failure(errors[0] ?? "Dados inválidos");
    }

    const category = new BudgetCategory(
      parsed.data.id,
      parsed.data.name,
      parsed.data.code,
      parsed.data.order,
    );

    return this.budgetCategoryRepository.update(category);
  }
}
