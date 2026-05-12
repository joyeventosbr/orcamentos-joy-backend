import { Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Budget } from "@domain/budgets/entities/budget.entity";
import { FolderBudget } from "@domain/budgets/entities/folder-budget.entity";
import type { IBudgetRepository } from "@domain/budgets/repositories/budget/i-budget-repository";
import type { IBudgetRelationRepository } from "@domain/budgets/repositories/relation/i-budget-relation-repository";
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

      const folderBudget = FolderBudget.create({
        folderId: data.folderId,
        budgetId: saved.id,
      });
      if (folderBudget.isFailure()) {
        return Result.failure(folderBudget.getError());
      }

      const folderBudgetResult =
        await this.budgetRelationRepository.createFolderBudget(
          folderBudget.getValue(),
        );
      if (folderBudgetResult.isFailure()) {
        return Result.failure(folderBudgetResult.getError());
      }

      const categoriesResult =
        await this.budgetRelationRepository.replaceBudgetCategoryLinks(
          saved.id,
          data.categories,
        );
      if (categoriesResult.isFailure()) {
        return Result.failure(categoriesResult.getError());
      }

      const itemsResult =
        await this.budgetRelationRepository.replaceBudgetLineItems(
          saved.id,
          data.items,
        );
      if (itemsResult.isFailure()) {
        return Result.failure(itemsResult.getError());
      }

      const createdBudget = await this.getHydratedBudget(saved.id);
      return Result.success(createdBudget ?? BudgetMapper.toEntity(saved));
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

      const folderBudget = FolderBudget.create({
        folderId: data.folderId,
        budgetId: data.id,
      });
      if (folderBudget.isFailure()) {
        return Result.failure(folderBudget.getError());
      }

      const folderBudgetResult =
        await this.budgetRelationRepository.replaceFolderBudget(
          folderBudget.getValue(),
        );
      if (folderBudgetResult.isFailure()) {
        return Result.failure(folderBudgetResult.getError());
      }

      const categoriesResult =
        await this.budgetRelationRepository.replaceBudgetCategoryLinks(
          data.id,
          data.categories,
        );
      if (categoriesResult.isFailure()) {
        return Result.failure(categoriesResult.getError());
      }

      const itemsResult =
        await this.budgetRelationRepository.replaceBudgetLineItems(
          data.id,
          data.items,
        );
      if (itemsResult.isFailure()) {
        return Result.failure(itemsResult.getError());
      }

      const updated = await this.getHydratedBudget(data.id);
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
      return Result.success(await this.getHydratedBudget(id));
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
          Budget.read({
            id: budget.id,
            folderId: folderIdResult.getValue() ?? "",
            client: budget.client,
            job: budget.job,
            deadline: budget.deadline,
            location: budget.location,
            folderDate: budget.folderDate,
            participants: budget.participants,
            categories: [],
            items: [],
            createdAt: budget.createdAt,
            updatedAt: budget.updatedAt,
          }),
        );
      }

      return Result.success(result);
    } catch (error) {
      return Result.failure("Falha ao listar orçamentos, erro: " + error);
    }
  }

  private async getHydratedBudget(id: string): Promise<Budget | null> {
    const budget = await this.budgetSchemaRepository.findOne({ where: { id } });
    if (!budget) {
      return null;
    }

    const folderIdResult =
      await this.budgetRelationRepository.getFolderIdByBudgetId(id);
    if (folderIdResult.isFailure()) {
      throw new Error(folderIdResult.getError());
    }

    const categoriesResult =
      await this.budgetRelationRepository.getCategoriesByBudgetId(id);
    if (categoriesResult.isFailure()) {
      throw new Error(categoriesResult.getError());
    }

    const itemsResult =
      await this.budgetRelationRepository.getLineItemsByBudgetId(id);
    if (itemsResult.isFailure()) {
      throw new Error(itemsResult.getError());
    }

    return Budget.read({
      id: budget.id,
      folderId: folderIdResult.getValue() ?? "",
      client: budget.client,
      job: budget.job,
      deadline: budget.deadline,
      location: budget.location,
      folderDate: budget.folderDate,
      participants: budget.participants,
      categories: categoriesResult.getValue(),
      items: itemsResult.getValue(),
      createdAt: budget.createdAt,
      updatedAt: budget.updatedAt,
    });
  }
}
