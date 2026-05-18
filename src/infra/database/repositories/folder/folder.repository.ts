import { Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Folder } from "@domain/folders/entities/folder.entity";
import { CustomerFolder } from "@domain/folders/entities/customer-folder.entity";
import type { IFolderRepository } from "@domain/folders/repositories/i-folder-repository";
import type { IBudgetRelationRepository } from "@domain/budgets/repositories/i-budget-relation-repository";
import { Result } from "@shared/result";
import { Repository } from "typeorm";
import { FolderSchema } from "@infra/database/typeorm/schemas/folder.schema";

@Injectable()
export class FolderRepository implements IFolderRepository {
  constructor(
    @InjectRepository(FolderSchema)
    private readonly folderSchemaRepository: Repository<FolderSchema>,
    @Inject("IBudgetRelationRepository")
    private readonly budgetRelationRepository: IBudgetRelationRepository,
  ) {}

  async create(data: Folder): Promise<Result<Folder>> {
    try {
      const saved = await this.folderSchemaRepository.save({
        name: data.name,
        createdAt: new Date(),
      });
      const relation = CustomerFolder.create({
        customerId: data.customerId,
        folderId: saved.id,
      });
      if (relation.isFailure()) {
        return Result.failure(relation.getError());
      }

      const relationResult =
        await this.budgetRelationRepository.createCustomerFolder(
          relation.getValue(),
        );
      if (relationResult.isFailure()) {
        return Result.failure(relationResult.getError());
      }

      return Result.success(
        Folder.read({
          id: saved.id,
          customerId: data.customerId,
          name: saved.name,
          createdAt: saved.createdAt,
          updatedAt: saved.updatedAt,
        }),
      );
    } catch (error) {
      return Result.failure("Falha ao criar pasta, erro: " + error);
    }
  }

  async update(data: Folder): Promise<Result<Folder>> {
    try {
      await this.folderSchemaRepository.save({
        id: data.id,
        name: data.name,
        createdAt: data.createdAt,
        updatedAt: new Date(),
      });

      const relation = CustomerFolder.create({
        customerId: data.customerId,
        folderId: data.id,
      });
      if (relation.isFailure()) {
        return Result.failure(relation.getError());
      }

      const relationResult =
        await this.budgetRelationRepository.replaceCustomerFolder(
          relation.getValue(),
        );
      if (relationResult.isFailure()) {
        return Result.failure(relationResult.getError());
      }

      return Result.success(data);
    } catch (error) {
      return Result.failure("Falha ao atualizar pasta, erro: " + error);
    }
  }

  async delete(id: string): Promise<Result<void>> {
    try {
      await this.folderSchemaRepository.delete({ id });
      return Result.success();
    } catch (error) {
      return Result.failure("Falha ao remover pasta, erro: " + error);
    }
  }

  async getById(id: string): Promise<Result<Folder | null>> {
    try {
      const folder = await this.folderSchemaRepository.findOne({ where: { id } });
      if (!folder) return Result.success(null);

      const customerIdResult =
        await this.budgetRelationRepository.getCustomerIdByFolderId(id);
      if (customerIdResult.isFailure()) {
        return Result.failure(customerIdResult.getError());
      }

      return Result.success(
        Folder.read({
          id: folder.id,
          customerId: customerIdResult.getValue() ?? "",
          name: folder.name,
          createdAt: folder.createdAt,
          updatedAt: folder.updatedAt,
        }),
      );
    } catch (error) {
      return Result.failure("Falha ao buscar pasta, erro: " + error);
    }
  }

  async getAll(): Promise<Result<Folder[]>> {
    try {
      const folders = await this.folderSchemaRepository.find({
        order: { createdAt: "DESC" },
      });
      const result: Folder[] = [];

      for (const folder of folders) {
        const customerIdResult =
          await this.budgetRelationRepository.getCustomerIdByFolderId(folder.id);
        if (customerIdResult.isFailure()) {
          return Result.failure(customerIdResult.getError());
        }

        result.push(
          Folder.read({
            id: folder.id,
            customerId: customerIdResult.getValue() ?? "",
            name: folder.name,
            createdAt: folder.createdAt,
            updatedAt: folder.updatedAt,
          }),
        );
      }

      return Result.success(result);
    } catch (error) {
      return Result.failure("Falha ao listar pastas, erro: " + error);
    }
  }
}
