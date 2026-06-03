import { Inject, Injectable } from "@nestjs/common";
import { SettingResponseDto } from "@domain/settings/dtos/setting-response.dto";
import type { ISettingRepository } from "@domain/settings/repositories/i-setting-repository";
import { Result } from "@shared/result";
import { ZError } from "@utils/index";
import { SettingResponseMapper } from "@application/settings/mappers/setting-response.mapper";
import { updateSettingSchema } from "./update-setting.dto";

@Injectable()
export class UpdateSettingUseCase {
  constructor(
    @Inject("ISettingRepository")
    private readonly settingRepository: ISettingRepository,
  ) {}

  async execute(input: unknown): Promise<Result<SettingResponseDto>> {
    const parsed = updateSettingSchema.safeParse(input);
    if (!parsed.success) {
      const errors = ZError.create(parsed.error).errors;
      return Result.failure(errors[0] ?? "Dados inválidos");
    }

    const current = await this.settingRepository.getById(parsed.data.id);
    if (current.isFailure()) return Result.failure(current.getError());

    const setting = current.getValue();
    if (!setting) return Result.failure("Parametrização não encontrada");

    if (parsed.data.key !== undefined && parsed.data.key !== setting.key) {
      const existingSetting = await this.settingRepository.getByKey(
        parsed.data.key,
      );
      if (existingSetting.isFailure()) {
        return Result.failure(existingSetting.getError());
      }

      const duplicated = existingSetting.getValue();
      if (duplicated && duplicated.id !== setting.id) {
        return Result.failure("Já existe uma parametrização com esta chave");
      }
    }

    const updatedSetting = setting.update({
      key: parsed.data.key,
      value: parsed.data.value,
    });
    if (updatedSetting.isFailure()) {
      return Result.failure(updatedSetting.getError());
    }

    const updated = await this.settingRepository.update(setting);
    if (updated.isFailure()) {
      return Result.failure(updated.getError());
    }

    return Result.success(SettingResponseMapper.toDto(updated.getValue()));
  }
}
