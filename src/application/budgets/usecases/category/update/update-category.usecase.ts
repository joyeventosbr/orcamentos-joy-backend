import { Inject, Injectable } from "@nestjs/common";
import type { ICategoryRepository } from "@domain/budgets/repositories/i-category-repository";
import { Category } from "@domain/budgets/entities/category.entity";
import { Result } from "@shared/result";
import { updateCategorySchema } from "./update-category.dto";
import { ZError } from "@utils/index";

@Injectable()
export class UpdateCategoryUseCase {
  constructor(
    @Inject("ICategoryRepository")
    private readonly categoryRepository: ICategoryRepository,
  ) {}

  async execute(input: unknown): Promise<Result<Category>> {
    const parsed = updateCategorySchema.safeParse(input);
    if (!parsed.success) {
      const errors = ZError.create(parsed.error).errors;
      return Result.failure(errors[0] ?? "Dados inválidos");
    }

    const current = await this.categoryRepository.getById(parsed.data.id);
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

    return await this.categoryRepository.update(
      categoryResult.getValue(),
    );
  }
}
