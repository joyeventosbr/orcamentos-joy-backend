import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CustomerFolder } from "@domain/folders/entities/customer-folder.entity";
import { FolderBudget } from "@domain/budgets/entities/folder-budget.entity";
import type { IBudgetRelationRepository } from "@domain/budgets/repositories/i-budget-relation-repository";
import { Result } from "@shared/result";
import { Repository } from "typeorm";
import { CustomerFolderSchema } from "@infra/database/typeorm/schemas/customer-folder.schema";
import { FolderBudgetSchema } from "@infra/database/typeorm/schemas/folder-budget.schema";

@Injectable()
export class BudgetRelationRepository implements IBudgetRelationRepository {
  constructor(
    @InjectRepository(CustomerFolderSchema)
    private readonly customerFolderSchemaRepository: Repository<CustomerFolderSchema>,
    @InjectRepository(FolderBudgetSchema)
    private readonly folderBudgetSchemaRepository: Repository<FolderBudgetSchema>,
  ) {}

  async createCustomerFolder(
    data: CustomerFolder,
  ): Promise<Result<CustomerFolder>> {
    try {
      const saved = await this.customerFolderSchemaRepository.save({
        customerId: data.customerId,
        folderId: data.folderId,
      });

      return Result.success(
        CustomerFolder.read({
          customerId: saved.customerId,
          folderId: saved.folderId,
        }),
      );
    } catch (error) {
      return Result.failure(
        "Falha ao vincular cliente e pasta, erro: " + error,
      );
    }
  }

  async createFolderBudget(data: FolderBudget): Promise<Result<FolderBudget>> {
    try {
      const saved = await this.folderBudgetSchemaRepository.save({
        folderId: data.folderId,
        budgetId: data.budgetId,
      });

      return Result.success(
        FolderBudget.read({
          folderId: saved.folderId,
          budgetId: saved.budgetId,
        }),
      );
    } catch (error) {
      return Result.failure(
        "Falha ao vincular pasta e orçamento, erro: " + error,
      );
    }
  }

  async replaceCustomerFolder(
    data: CustomerFolder,
  ): Promise<Result<CustomerFolder>> {
    await this.customerFolderSchemaRepository.delete({
      folderId: data.folderId,
    });
    return this.createCustomerFolder(data);
  }

  async replaceFolderBudget(data: FolderBudget): Promise<Result<FolderBudget>> {
    await this.folderBudgetSchemaRepository.delete({ budgetId: data.budgetId });
    return this.createFolderBudget(data);
  }

  async getCustomerIdByFolderId(
    folderId: string,
  ): Promise<Result<string | null>> {
    try {
      const customerFolder = await this.customerFolderSchemaRepository.findOne({
        where: { folderId },
      });

      return Result.success(customerFolder?.customerId ?? null);
    } catch (error) {
      return Result.failure("Falha ao buscar vínculo da pasta, erro: " + error);
    }
  }

  async getFolderIdByBudgetId(
    budgetId: string,
  ): Promise<Result<string | null>> {
    try {
      const folderBudget = await this.folderBudgetSchemaRepository.findOne({
        where: { budgetId },
      });

      return Result.success(folderBudget?.folderId ?? null);
    } catch (error) {
      return Result.failure(
        "Falha ao buscar vínculo do orçamento, erro: " + error,
      );
    }
  }
}
