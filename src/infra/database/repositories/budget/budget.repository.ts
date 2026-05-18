import { Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Budget } from "@domain/budgets/entities/budget.entity";
import { FolderBudget } from "@domain/budgets/entities/folder-budget.entity";
import type { IBudgetRepository } from "@domain/budgets/repositories/i-budget-repository";
import type { IBudgetRelationRepository } from "@domain/budgets/repositories/i-budget-relation-repository";
import { Result } from "@shared/result";
import { Repository } from "typeorm";
import { BudgetSchema } from "@infra/database/typeorm/schemas/budget.schema";
import { BudgetMapper } from "@infra/database/mappers/budget.mapper";

@Injectable()
export class BudgetRepository implements IBudgetRepository {
  constructor(
    @InjectRepository(BudgetSchema)
    private readonly budgetSchemaRepository: Repository<BudgetSchema>,
    @Inject("IBudgetRelationRepository")
    private readonly budgetRelationRepository: IBudgetRelationRepository,
  ) {}

  async create(data: Budget): Promise<Result<Budget>> {
    try {
      const saved = await this.budgetSchemaRepository.save({
        ...BudgetMapper.toSchema(data),
        createdAt: new Date(),
      });

      const folderBudgetResult = await this.saveFolderBudget(
        data.folderId,
        saved.id,
      );
      if (folderBudgetResult.isFailure()) {
        return Result.failure(folderBudgetResult.getError());
      }

      const createdBudget = await this.getBudget(saved.id);
      return Result.success(
        createdBudget ?? BudgetMapper.toEntity(saved, data.folderId),
      );
    } catch (error) {
      return Result.failure("Falha ao criar orçamento, erro: " + error);
    }
  }

  async update(data: Budget): Promise<Result<Budget>> {
    try {
      await this.budgetSchemaRepository.save({
        ...BudgetMapper.toSchema(data),
        id: data.id,
        updatedAt: new Date(),
      });

      const folderBudgetResult = await this.saveFolderBudget(
        data.folderId,
        data.id,
        true,
      );
      if (folderBudgetResult.isFailure()) {
        return Result.failure(folderBudgetResult.getError());
      }

      const updated = await this.getBudget(data.id);
      if (!updated) return Result.failure("Orçamento não encontrado");

      return Result.success(updated);
    } catch (error) {
      return Result.failure("Falha ao atualizar orçamento, erro: " + error);
    }
  }

  async delete(id: string): Promise<Result<void>> {
    try {
      await this.budgetSchemaRepository.delete({ id });
      return Result.success();
    } catch (error) {
      return Result.failure("Falha ao remover orçamento, erro: " + error);
    }
  }

  async getById(id: string): Promise<Result<Budget | null>> {
    try {
      return Result.success(await this.getBudget(id));
    } catch (error) {
      return Result.failure("Falha ao buscar orçamento, erro: " + error);
    }
  }

  async getAll(): Promise<Result<Budget[]>> {
    try {
      const budgets = await this.budgetSchemaRepository.find({
        order: { createdAt: "DESC" },
      });
      const result: Budget[] = [];

      for (const budget of budgets) {
        const folderIdResult =
          await this.budgetRelationRepository.getFolderIdByBudgetId(budget.id);
        if (folderIdResult.isFailure()) {
          return Result.failure(folderIdResult.getError());
        }

        result.push(
          BudgetMapper.toEntity(budget, folderIdResult.getValue() ?? ""),
        );
      }

      return Result.success(result);
    } catch (error) {
      return Result.failure("Falha ao listar orçamentos, erro: " + error);
    }
  }

  private async getBudget(id: string): Promise<Budget | null> {
    const budget = await this.budgetSchemaRepository.findOne({ where: { id } });
    if (!budget) return null;

    const folderIdResult =
      await this.budgetRelationRepository.getFolderIdByBudgetId(id);
    if (folderIdResult.isFailure()) {
      throw new Error(folderIdResult.getError());
    }

    return BudgetMapper.toEntity(budget, folderIdResult.getValue() ?? "");
  }

  private async saveFolderBudget(
    folderId: string,
    budgetId: string,
    replace = false,
  ): Promise<Result<FolderBudget>> {
    const folderBudget = FolderBudget.create({ folderId, budgetId });
    if (folderBudget.isFailure()) {
      return Result.failure(folderBudget.getError());
    }

    return replace
      ? this.budgetRelationRepository.replaceFolderBudget(
          folderBudget.getValue(),
        )
      : this.budgetRelationRepository.createFolderBudget(
          folderBudget.getValue(),
        );
  }
}
