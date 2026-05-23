import { SettingResponseDto } from "@domain/settings/dtos/setting-response.dto";
import { Setting } from "@domain/settings/entities/setting.entity";

export class SettingResponseMapper {
  static toDto(setting: Setting): SettingResponseDto {
    return {
      id: setting.id,
      key: setting.key,
      value: setting.value,
      createdAt: setting.createdAt,
      updatedAt: setting.updatedAt,
    };
  }
}
