import { Result } from "@shared/result";

export class BudgetCategory {
  private constructor(
    public id: string,
    public name: string,
    public code: string,
    public order: number,
  ) {}

  static create(input: {
    name: string;
    code: string;
    order: number;
  }): Result<BudgetCategory> {
    if (!input.name?.trim()) {
      return Result.failure("Nome da categoria é obrigatório");
    }

    if (!input.code?.trim()) {
      return Result.failure("Código da categoria é obrigatório");
    }

    if (input.order < 0) {
      return Result.failure("Ordem da categoria inválida");
    }

    return Result.success(
      new BudgetCategory(
        "",
        input.name.trim(),
        input.code.trim(),
        input.order,
      ),
    );
  }

  static read(input: {
    id: string;
    name: string;
    code: string;
    order: number;
  }): BudgetCategory {
    return new BudgetCategory(input.id, input.name, input.code, input.order);
  }
}
