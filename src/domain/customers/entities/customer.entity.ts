import { Result } from "@shared/result";

export class Customer {
  private constructor(
    public id: string,
    public name: string,
    public createdAt: Date,
    public updatedAt?: Date,
  ) {}

  static create(input: { name: string }): Result<Customer> {
    if (!input.name?.trim()) {
      return Result.failure("Nome do cliente é obrigatório");
    }

    return Result.success(new Customer("", input.name.trim(), new Date()));
  }

  static read(input: {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt?: Date;
  }): Customer {
    return new Customer(input.id, input.name, input.createdAt, input.updatedAt);
  }

  update(input: { name?: string }): Result<Customer> {
    if (input.name !== undefined) {
      if (!input.name.trim()) {
        return Result.failure("Nome do cliente é obrigatório");
      }

      this.name = input.name.trim();
    }

    this.updatedAt = new Date();
    return Result.success(this);
  }
}
