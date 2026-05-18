import { Inject, Injectable } from "@nestjs/common";
import type { IBudgetCategoryRepository } from "@domain/budgets/repositories/i-budget-category-repository";
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

  async execute(input: unknown): Promise<Result<BudgetCategory>> {
    const parsed = updateCategorySchema.safeParse(input);
    if (!parsed.success) {
      const errors = ZError.create(parsed.error).errors;
      return Result.failure(errors[0] ?? "Dados inválidos");
    }

    const current = await this.budgetCategoryRepository.getById(parsed.data.id);
    if (current.isFailure()) return Result.failure(current.getError());

    const category = current.getValue();
    if (!category) return Result.failure("Categoria não encontrada");

    const categoryResult = category.update({
      name: parsed.data.name,
      code: parsed.data.code,
      order: parsed.data.order,
    });
    if (categoryResult.isFailure()) {
      return Result.failure(categoryResult.getError());
    }

    return await this.budgetCategoryRepository.update(
      categoryResult.getValue(),
    );
  }
}
