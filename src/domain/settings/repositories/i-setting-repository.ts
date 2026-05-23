import { Setting } from "@domain/settings/entities/setting.entity";
import { Result } from "@shared/result";

export interface ISettingRepository {
  create(data: Setting): Promise<Result<Setting>>;
  update(data: Setting): Promise<Result<Setting>>;
  delete(id: string): Promise<Result<void>>;
  getById(id: string): Promise<Result<Setting | null>>;
  getByKey(key: string): Promise<Result<Setting | null>>;
  getAll(): Promise<Result<Setting[]>>;
}
