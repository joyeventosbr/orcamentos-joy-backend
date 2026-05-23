import { Inject, Injectable } from "@nestjs/common";
import type { ISettingRepository } from "@domain/settings/repositories/i-setting-repository";
import { Result } from "@shared/result";
import { ZError } from "@utils/index";
import { deleteSettingSchema } from "./delete-setting.dto";

@Injectable()
export class DeleteSettingUseCase {
  constructor(
    @Inject("ISettingRepository")
    private readonly settingRepository: ISettingRepository,
  ) {}

  async execute(input: unknown): Promise<Result<void>> {
    const parsed = deleteSettingSchema.safeParse(input);
    if (!parsed.success) {
      const errors = ZError.create(parsed.error).errors;
      return Result.failure(errors[0] ?? "Dados inválidos");
    }

    const current = await this.settingRepository.getById(parsed.data.id);
    if (current.isFailure()) return Result.failure(current.getError());
    if (!current.getValue())
      return Result.failure("Parametrização não encontrada");

    return this.settingRepository.delete(parsed.data.id);
  }
}
