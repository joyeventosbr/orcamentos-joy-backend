import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BudgetCategory } from "@domain/budgets/entities/budget-category.entity";
import type { IBudgetCategoryRepository } from "@domain/budgets/repositories/i-budget-category-repository";
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
        BudgetCategory.read({
          id: saved.id,
          name: saved.name,
          code: saved.code,
          order: saved.order,
        }),
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
        BudgetCategory.read({
          id: saved.id,
          name: saved.name,
          code: saved.code,
          order: saved.order,
        }),
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

  async getById(id: string): Promise<Result<BudgetCategory | null>> {
    try {
      const category = await this.budgetCategorySchemaRepository.findOne({
        where: { id },
      });
      if (!category) return Result.success(null);

      return Result.success(
        BudgetCategory.read({
          id: category.id,
          name: category.name,
          code: category.code,
          order: category.order,
        }),
      );
    } catch (error) {
      return Result.failure("Falha ao buscar categoria, erro: " + error);
    }
  }

  async getAll(): Promise<Result<BudgetCategory[]>> {
    try {
      const categories = await this.budgetCategorySchemaRepository.find({
        order: { order: "ASC", name: "ASC" },
      });

      return Result.success(
        categories.map((category) =>
          BudgetCategory.read({
            id: category.id,
            name: category.name,
            code: category.code,
            order: category.order,
          }),
        ),
      );
    } catch (error) {
      return Result.failure("Falha ao listar categorias, erro: " + error);
    }
  }
}
