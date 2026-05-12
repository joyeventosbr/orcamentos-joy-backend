import { Inject, Injectable } from "@nestjs/common";
import type { IFolderRepository } from "@domain/budgets/repositories/folder/i-folder-repository";
import { Result } from "@shared/result";
import { deleteFolderSchema } from "./delete-folder.dto";
import { ZError } from "@utils/index";

@Injectable()
export class DeleteFolderUseCase {
  constructor(
    @Inject("IFolderRepository")
    private readonly folderRepository: IFolderRepository,
  ) {}

  async execute(input: unknown): Promise<Result<void>> {
    const parsed = deleteFolderSchema.safeParse(input);
    if (!parsed.success) {
      const errors = ZError.create(parsed.error).errors;
      return Result.failure(errors[0] ?? "Dados inválidos");
    }

    return this.folderRepository.delete(parsed.data.id);
  }
}
