import { Inject, Injectable } from "@nestjs/common";
import { Folder } from "@domain/budgets/entities/folder.entity";
import type { IFolderRepository } from "@domain/budgets/repositories/folder/i-folder-repository";
import { Result } from "@shared/result";
import { updateFolderSchema } from "./update-folder.dto";
import { ZError } from "@utils/index";

@Injectable()
export class UpdateFolderUseCase {
  constructor(
    @Inject("IFolderRepository")
    private readonly folderRepository: IFolderRepository,
  ) {}

  async execute(input: unknown): Promise<Result<Folder>> {
    const parsed = updateFolderSchema.safeParse(input);
    if (!parsed.success) {
      const errors = ZError.create(parsed.error).errors;
      return Result.failure(errors[0] ?? "Dados inválidos");
    }

    const folderResult = await this.folderRepository.getById(parsed.data.id);
    if (folderResult.isFailure()) return Result.failure(folderResult.getError());
    const folder = folderResult.getValue();
    if (!folder) return Result.failure("Pasta não encontrada");

    folder.name = parsed.data.name;
    folder.updatedAt = new Date();

    return this.folderRepository.update(folder);
  }
}
