import { Result } from "@shared/result";

export class Folder {
  private constructor(
    public id: string,
    public customerId: string,
    public name: string,
    public createdAt: Date,
    public updatedAt?: Date,
  ) {}

  static create(input: { customerId: string; name: string }): Result<Folder> {
    if (!input.customerId?.trim()) {
      return Result.failure("Cliente é obrigatório");
    }

    if (!input.name?.trim()) {
      return Result.failure("Nome da pasta é obrigatório");
    }

    return Result.success(
      new Folder("", input.customerId.trim(), input.name.trim(), new Date()),
    );
  }

  static read(input: {
    id: string;
    customerId: string;
    name: string;
    createdAt: Date;
    updatedAt?: Date;
  }): Folder {
    return new Folder(
      input.id,
      input.customerId,
      input.name,
      input.createdAt,
      input.updatedAt,
    );
  }
}
