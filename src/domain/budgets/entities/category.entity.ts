import { Result } from "@shared/result";

export class Category {
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
  }): Result<Category> {
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
      new Category("", input.name.trim(), input.code.trim(), input.order),
    );
  }

  static read(input: {
    id: string;
    name: string;
    code: string;
    order: number;
  }): Category {
    return new Category(input.id, input.name, input.code, input.order);
  }

  update(input: {
    name?: string;
    code?: string;
    order?: number;
  }): Result<Category> {
    if (input.name !== undefined) {
      if (!input.name.trim()) {
        return Result.failure("Nome da categoria é obrigatório");
      }

      this.name = input.name.trim();
    }

    if (input.code !== undefined) {
      if (!input.code.trim()) {
        return Result.failure("Código da categoria é obrigatório");
      }

      this.code = input.code.trim();
    }

    if (input.order !== undefined) {
      if (input.order < 0) {
        return Result.failure("Ordem da categoria inválida");
      }

      this.order = input.order;
    }

    return Result.success(this);
  }
}
