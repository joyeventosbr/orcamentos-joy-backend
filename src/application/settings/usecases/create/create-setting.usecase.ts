import { Inject, Injectable } from "@nestjs/common";
import { Setting } from "@domain/settings/entities/setting.entity";
import { SettingResponseDto } from "@domain/settings/dtos/setting-response.dto";
import type { ISettingRepository } from "@domain/settings/repositories/i-setting-repository";
import { Result } from "@shared/result";
import { ZError } from "@utils/index";
import { SettingResponseMapper } from "@application/settings/mappers/setting-response.mapper";
import { createSettingSchema } from "./create-setting.dto";

@Injectable()
export class CreateSettingUseCase {
  constructor(
    @Inject("ISettingRepository")
    private readonly settingRepository: ISettingRepository,
  ) {}

  async execute(input: unknown): Promise<Result<SettingResponseDto>> {
    const parsed = createSettingSchema.safeParse(input);
    if (!parsed.success) {
      const errors = ZError.create(parsed.error).errors;
      return Result.failure(errors[0] ?? "Dados inválidos");
    }

    const existingSetting = await this.settingRepository.getByKey(
      parsed.data.key,
    );
    if (existingSetting.isFailure()) {
      return Result.failure(existingSetting.getError());
    }
    if (existingSetting.getValue()) {
      return Result.failure("Já existe uma parametrização com esta chave");
    }

    const settingResult = Setting.create({
      key: parsed.data.key,
      value: parsed.data.value,
    });
    if (settingResult.isFailure()) {
      return Result.failure(settingResult.getError());
    }

    const created = await this.settingRepository.create(
      settingResult.getValue(),
    );
    if (created.isFailure()) {
      return Result.failure(created.getError());
    }

    return Result.success(SettingResponseMapper.toDto(created.getValue()));
  }
}
