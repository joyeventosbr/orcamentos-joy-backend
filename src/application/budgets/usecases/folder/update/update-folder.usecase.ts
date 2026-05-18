import { Inject, Injectable } from "@nestjs/common";
import { Folder } from "@domain/folders/entities/folder.entity";
import type { IFolderRepository } from "@domain/folders/repositories/i-folder-repository";
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

    const folderUpdateResult = folder.update({
      customerId: parsed.data.customerId,
      name: parsed.data.name,
    });
    if (folderUpdateResult.isFailure()) {
      return Result.failure(folderUpdateResult.getError());
    }

    return this.folderRepository.update(folderUpdateResult.getValue());
  }
}
