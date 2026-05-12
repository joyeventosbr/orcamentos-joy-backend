import { Result } from "@shared/result";

export class BudgetCategoryLink {
  private constructor(
    public budgetId: string,
    public categoryId: string,
  ) {}

  static create(input: {
    budgetId: string;
    categoryId: string;
  }): Result<BudgetCategoryLink> {
    if (!input.budgetId?.trim()) {
      return Result.failure("Orçamento é obrigatório");
    }

    if (!input.categoryId?.trim()) {
      return Result.failure("Categoria é obrigatória");
    }

    return Result.success(
      new BudgetCategoryLink(input.budgetId.trim(), input.categoryId.trim()),
    );
  }

  static read(input: {
    budgetId: string;
    categoryId: string;
  }): BudgetCategoryLink {
    return new BudgetCategoryLink(input.budgetId, input.categoryId);
  }
}
