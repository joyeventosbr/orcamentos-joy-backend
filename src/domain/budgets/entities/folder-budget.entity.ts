import { Result } from "@shared/result";

export class FolderBudget {
  private constructor(
    public folderId: string,
    public budgetId: string,
  ) {}

  static create(input: {
    folderId: string;
    budgetId: string;
  }): Result<FolderBudget> {
    if (!input.folderId?.trim()) {
      return Result.failure("Pasta é obrigatória");
    }

    if (!input.budgetId?.trim()) {
      return Result.failure("Orçamento é obrigatório");
    }

    return Result.success(
      new FolderBudget(input.folderId.trim(), input.budgetId.trim()),
    );
  }

  static read(input: { folderId: string; budgetId: string }): FolderBudget {
    return new FolderBudget(input.folderId, input.budgetId);
  }
}
