import { Inject, Injectable } from "@nestjs/common";
import type { ICategoryRepository } from "@domain/budgets/repositories/i-category-repository";
import { Result } from "@shared/result";
import { deleteCategorySchema } from "./delete-category.dto";
import { ZError } from "@utils/index";

@Injectable()
export class DeleteCategoryUseCase {
  constructor(
    @Inject("ICategoryRepository")
    private readonly categoryRepository: ICategoryRepository,
  ) {}

  async execute(input: unknown): Promise<Result<void>> {
    const parsed = deleteCategorySchema.safeParse(input);
    if (!parsed.success) {
      const errors = ZError.create(parsed.error).errors;
      return Result.failure(errors[0] ?? "Dados inválidos");
    }

    const deleted = await this.categoryRepository.delete(parsed.data.id);
    if (deleted.isFailure()) {
      return Result.failure(deleted.getError());
    }

    return Result.success(undefined);
  }
}
