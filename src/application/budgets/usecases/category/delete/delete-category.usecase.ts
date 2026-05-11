import { Inject, Injectable } from "@nestjs/common";
import type { IBudgetCategoryRepository } from "@domain/budgets/repositories/category/i-budget-category-repository";
import { Result } from "@shared/result";
import { deleteCategorySchema } from "./delete-category.dto";
import { ZError } from "@utils/index";

@Injectable()
export class DeleteCategoryUseCase {
  constructor(
    @Inject("IBudgetCategoryRepository")
    private readonly budgetCategoryRepository: IBudgetCategoryRepository,
  ) {}

  async execute(input: unknown) {
    const parsed = deleteCategorySchema.safeParse(input);
    if (!parsed.success) {
      const errors = ZError.create(parsed.error).errors;
      return Result.failure(errors[0] ?? "Dados inválidos");
    }

    return this.budgetCategoryRepository.delete(parsed.data.id);
  }
}
