import { Inject, Injectable } from "@nestjs/common";
import type { ICategoryRepository } from "@domain/budgets/repositories/i-category-repository";
import { Category } from "@domain/budgets/entities/category.entity";
import { Result } from "@shared/result";
import { createCategorySchema } from "./create-category.dto";
import { ZError } from "@utils/index";

@Injectable()
export class CreateCategoryUseCase {
  constructor(
    @Inject("ICategoryRepository")
    private readonly categoryRepository: ICategoryRepository,
  ) {}

  async execute(input: unknown): Promise<Result<Category>> {
    const parsed = createCategorySchema.safeParse(input);
    if (!parsed.success) {
      const errors = ZError.create(parsed.error).errors;
      return Result.failure(errors[0] ?? "Dados inválidos");
    }

    const existingCategory = await this.categoryRepository.getByCode(
      parsed.data.code,
    );
    if (existingCategory.isFailure()) {
      return Result.failure(existingCategory.getError());
    }
    if (existingCategory.getValue()) {
      return Result.failure("Já existe uma categoria com este código");
    }

    const categoryResult = Category.create({
      name: parsed.data.name,
      code: parsed.data.code,
      order: parsed.data.order,
    });
    if (categoryResult.isFailure()) {
      return Result.failure(categoryResult.getError());
    }

    return this.categoryRepository.create(categoryResult.getValue());
  }
}
