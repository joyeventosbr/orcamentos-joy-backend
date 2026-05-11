import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BudgetCategory } from "@domain/budgets/entities/budget-category.entity";
import type { IBudgetCategoryRepository } from "@domain/budgets/repositories/category/i-budget-category-repository";
import { Result } from "@shared/result";
import { Repository } from "typeorm";
import { BudgetCategorySchema } from "@infra/database/typeorm/schemas/budget-category.schema";

@Injectable()
export class BudgetCategoryRepository implements IBudgetCategoryRepository {
  constructor(
    @InjectRepository(BudgetCategorySchema)
    private readonly budgetCategorySchemaRepository: Repository<BudgetCategorySchema>,
  ) {}

  async create(data: BudgetCategory): Promise<Result<BudgetCategory>> {
    try {
      const saved = await this.budgetCategorySchemaRepository.save({
        name: data.name,
        code: data.code,
        order: data.order,
      });

      return Result.success(
        new BudgetCategory(saved.id, saved.name, saved.code, saved.order),
      );
    } catch (error) {
      return Result.failure("Falha ao criar categoria, erro: " + error);
    }
  }

  async update(data: BudgetCategory): Promise<Result<BudgetCategory>> {
    try {
      const saved = await this.budgetCategorySchemaRepository.save({
        id: data.id,
        name: data.name,
        code: data.code,
        order: data.order,
      });

      return Result.success(
        new BudgetCategory(saved.id, saved.name, saved.code, saved.order),
      );
    } catch (error) {
      return Result.failure("Falha ao atualizar categoria, erro: " + error);
    }
  }

  async delete(id: string): Promise<Result<void>> {
    try {
      await this.budgetCategorySchemaRepository.delete({ id });
      return Result.success();
    } catch (error) {
      return Result.failure("Falha ao remover categoria, erro: " + error);
    }
  }
}
