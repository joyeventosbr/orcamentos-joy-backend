import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Category } from "@domain/budgets/entities/category.entity";
import type { ICategoryRepository } from "@domain/budgets/repositories/i-category-repository";
import { Result } from "@shared/result";
import { Repository } from "typeorm";
import { CategorySchema } from "@infra/database/typeorm/schemas/category.schema";

@Injectable()
export class CategoryRepository implements ICategoryRepository {
  constructor(
    @InjectRepository(CategorySchema)
    private readonly categorySchemaRepository: Repository<CategorySchema>,
  ) {}

  async create(data: Category): Promise<Result<Category>> {
    try {
      const saved = await this.categorySchemaRepository.save({
        name: data.name,
        code: data.code,
        order: data.order,
      });

      return Result.success(
        Category.read({
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

  async update(data: Category): Promise<Result<Category>> {
    try {
      const saved = await this.categorySchemaRepository.save({
        id: data.id,
        name: data.name,
        code: data.code,
        order: data.order,
      });

      return Result.success(
        Category.read({
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
      await this.categorySchemaRepository.delete({ id });
      return Result.success();
    } catch (error) {
      return Result.failure("Falha ao remover categoria, erro: " + error);
    }
  }

  async getById(id: string): Promise<Result<Category | null>> {
    try {
      const category = await this.categorySchemaRepository.findOne({
        where: { id },
      });
      if (!category) return Result.success(null);

      return Result.success(
        Category.read({
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

  async getByCode(code: string): Promise<Result<Category | null>> {
    try {
      const category = await this.categorySchemaRepository.findOne({
        where: { code },
      });
      if (!category) return Result.success(null);

      return Result.success(
        Category.read({
          id: category.id,
          name: category.name,
          code: category.code,
          order: category.order,
        }),
      );
    } catch (error) {
      return Result.failure(
        "Falha ao buscar categoria por código, erro: " + error,
      );
    }
  }

  async getAll(): Promise<Result<Category[]>> {
    try {
      const categories = await this.categorySchemaRepository.find({
        order: { order: "ASC", name: "ASC" },
      });

      return Result.success(
        categories.map((category) =>
          Category.read({
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
