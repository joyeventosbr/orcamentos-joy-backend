import { Inject, Injectable } from "@nestjs/common";
import { Folder } from "@domain/budgets/entities/folder.entity";
import type { IFolderRepository } from "@domain/budgets/repositories/folder/i-folder-repository";
import { Result } from "@shared/result";

@Injectable()
export class GetAllFoldersUseCase {
  constructor(
    @Inject("IFolderRepository")
    private readonly folderRepository: IFolderRepository,
  ) {}

  async execute(): Promise<Result<Folder[]>> {
    return this.folderRepository.getAll();
  }
}
