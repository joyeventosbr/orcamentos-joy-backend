import { Folder } from "@domain/folders/entities/folder.entity";
import { Result } from "@shared/result";

export interface IFolderRepository {
  create(data: Folder): Promise<Result<Folder>>;
  update(data: Folder): Promise<Result<Folder>>;
  delete(id: string): Promise<Result<void>>;
  getById(id: string): Promise<Result<Folder | null>>;
  getAll(): Promise<Result<Folder[]>>;
}
