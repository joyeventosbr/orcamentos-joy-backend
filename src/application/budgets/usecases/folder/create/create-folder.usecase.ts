import { Inject, Injectable } from "@nestjs/common";
import type { IFolderRepository } from "@domain/folders/repositories/i-folder-repository";
import { Folder } from "@domain/folders/entities/folder.entity";
import { Result } from "@shared/result";
import { createFolderSchema } from "./create-folder.dto";
import { ZError } from "@utils/index";

@Injectable()
export class CreateFolderUseCase {
  constructor(
    @Inject("IFolderRepository")
    private readonly folderRepository: IFolderRepository,
  ) {}

  async execute(input: unknown): Promise<Result<Folder>> {
    const parsed = createFolderSchema.safeParse(input);
    if (!parsed.success) {
      const errors = ZError.create(parsed.error).errors;
      return Result.failure(errors[0] ?? "Dados inválidos");
    }

    const folderResult = Folder.create({
      customerId: parsed.data.customerId,
      name: parsed.data.name,
    });
    if (folderResult.isFailure()) {
      return Result.failure(folderResult.getError());
    }

    return this.folderRepository.create(folderResult.getValue());
  }
}
