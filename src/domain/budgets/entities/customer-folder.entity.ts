import { Result } from "@shared/result";

export class CustomerFolder {
  private constructor(
    public customerId: string,
    public folderId: string,
  ) {}

  static create(input: {
    customerId: string;
    folderId: string;
  }): Result<CustomerFolder> {
    if (!input.customerId?.trim()) {
      return Result.failure("Cliente é obrigatório");
    }

    if (!input.folderId?.trim()) {
      return Result.failure("Pasta é obrigatória");
    }

    return Result.success(
      new CustomerFolder(input.customerId.trim(), input.folderId.trim()),
    );
  }

  static read(input: { customerId: string; folderId: string }): CustomerFolder {
    return new CustomerFolder(input.customerId, input.folderId);
  }
}
