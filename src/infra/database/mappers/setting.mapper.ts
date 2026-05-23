import { Setting } from "@domain/settings/entities/setting.entity";
import { SettingSchema } from "@infra/database/typeorm/schemas/setting.schema";

export class SettingMapper {
  static toSchema(setting: Setting): Partial<SettingSchema> {
    return {
      id: setting.id || undefined,
      key: setting.key,
      value: setting.value,
      createdAt: setting.createdAt,
      updatedAt: setting.updatedAt,
    };
  }

  static toEntity(schema: SettingSchema): Setting {
    return Setting.read({
      id: schema.id,
      key: schema.key,
      value: schema.value,
      createdAt: schema.createdAt,
      updatedAt: schema.updatedAt,
    });
  }
}
