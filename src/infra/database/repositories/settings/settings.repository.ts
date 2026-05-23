import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Setting } from "@domain/settings/entities/setting.entity";
import type { ISettingRepository } from "@domain/settings/repositories/i-setting-repository";
import { Result } from "@shared/result";
import { Repository } from "typeorm";
import { SettingMapper } from "@infra/database/mappers/setting.mapper";
import { SettingSchema } from "@infra/database/typeorm/schemas/setting.schema";

@Injectable()
export class SettingsRepository implements ISettingRepository {
  constructor(
    @InjectRepository(SettingSchema)
    private readonly settingSchemaRepository: Repository<SettingSchema>,
  ) {}

  async create(data: Setting): Promise<Result<Setting>> {
    try {
      const saved = await this.settingSchemaRepository.save(
        SettingMapper.toSchema(data),
      );

      return Result.success(SettingMapper.toEntity(saved));
    } catch (error) {
      if (this.isDuplicatedKeyError(error)) {
        return Result.failure("Já existe uma parametrização com esta chave");
      }

      return Result.failure("Falha ao criar parametrização, erro: " + error);
    }
  }

  async update(data: Setting): Promise<Result<Setting>> {
    try {
      const current = await this.settingSchemaRepository.findOne({
        where: { id: data.id },
      });
      if (!current) return Result.failure("Parametrização não encontrada");

      const saved = await this.settingSchemaRepository.save({
        id: current.id,
        key: data.key,
        value: data.value,
        createdAt: current.createdAt,
        updatedAt: data.updatedAt ?? new Date(),
      });

      return Result.success(SettingMapper.toEntity(saved));
    } catch (error) {
      if (this.isDuplicatedKeyError(error)) {
        return Result.failure("Já existe uma parametrização com esta chave");
      }

      return Result.failure(
        "Falha ao atualizar parametrização, erro: " + error,
      );
    }
  }

  async delete(id: string): Promise<Result<void>> {
    try {
      await this.settingSchemaRepository.delete({ id });
      return Result.success();
    } catch (error) {
      return Result.failure("Falha ao remover parametrização, erro: " + error);
    }
  }

  async getById(id: string): Promise<Result<Setting | null>> {
    try {
      const setting = await this.settingSchemaRepository.findOne({
        where: { id },
      });
      if (!setting) return Result.success(null);

      return Result.success(SettingMapper.toEntity(setting));
    } catch (error) {
      return Result.failure("Falha ao buscar parametrização, erro: " + error);
    }
  }

  async getByKey(key: string): Promise<Result<Setting | null>> {
    try {
      const setting = await this.settingSchemaRepository.findOne({
        where: { key },
      });
      if (!setting) return Result.success(null);

      return Result.success(SettingMapper.toEntity(setting));
    } catch (error) {
      return Result.failure(
        "Falha ao buscar parametrização por chave, erro: " + error,
      );
    }
  }

  async getAll(): Promise<Result<Setting[]>> {
    try {
      const settings = await this.settingSchemaRepository.find({
        order: { key: "ASC" },
      });

      return Result.success(
        settings.map((setting) => SettingMapper.toEntity(setting)),
      );
    } catch (error) {
      return Result.failure("Falha ao listar parametrizações, erro: " + error);
    }
  }

  private isDuplicatedKeyError(error: unknown): boolean {
    return error instanceof Error && error.message.includes("duplicate key");
  }
}
