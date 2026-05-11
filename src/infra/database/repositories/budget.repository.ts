import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Budget } from "@domain/budgets/entities/budget.entity";
import type { IBudgetRepository } from "@domain/budgets/repositories/i-budget-repository";
import { Result } from "@shared/result";
import { Repository } from "typeorm";
import { BudgetSchema } from "../typeorm/schemas/budget.schema";
import { BudgetMapper } from "../mappers/budget.mapper";
import { Event } from "@domain/budgets/entities/event.entity";
import { BudgetCategory } from "@domain/budgets/entities/budget-category.entity";
import { EventSchema } from "../typeorm/schemas/event.schema";
import { BudgetCategorySchema } from "../typeorm/schemas/budget-category.schema";
import { CompanySchema } from "../typeorm/schemas/company.schema";
import { Company } from "@domain/budgets/entities/company.entity";

@Injectable()
export class BudgetRepository implements IBudgetRepository {
  constructor(
    @InjectRepository(BudgetSchema)
    private readonly budgetSchemaRepository: Repository<BudgetSchema>,
    @InjectRepository(EventSchema)
    private readonly eventSchemaRepository: Repository<EventSchema>,
    @InjectRepository(BudgetCategorySchema)
    private readonly budgetCategorySchemaRepository: Repository<BudgetCategorySchema>,
    @InjectRepository(CompanySchema)
    private readonly companySchemaRepository: Repository<CompanySchema>,
  ) {}

  async create(data: Budget): Promise<Result<Budget>> {
    try {
      const schema = this.budgetSchemaRepository.create({
        ...BudgetMapper.toSchema(data),
        createdAt: new Date(),
      });

      const saved = await this.budgetSchemaRepository.save(schema);
      return Result.success(BudgetMapper.toEntity(saved));
    } catch (error) {
      return Result.failure("Falha ao criar orçamento, erro: " + error?.message);
    }
  }

  async update(data: Budget): Promise<Result<Budget>> {
    try {
      await this.budgetSchemaRepository.save({
        ...BudgetMapper.toSchema(data),
        id: data.id,
        updatedAt: new Date(),
      });

      const updated = await this.budgetSchemaRepository.findOne({
        where: { id: data.id },
      });

      if (!updated) return Result.failure("Orçamento não encontrado");

      return Result.success(BudgetMapper.toEntity(updated));
    } catch (error) {
      return Result.failure(
        "Falha ao atualizar orçamento, erro: " + error?.message,
      );
    }
  }

  async delete(id: string): Promise<Result<void>> {
    try {
      await this.budgetSchemaRepository.delete({ id });
      return Result.success();
    } catch (error) {
      return Result.failure("Falha ao remover orçamento, erro: " + error?.message);
    }
  }

  async getById(id: string): Promise<Result<Budget | null>> {
    try {
      const budget = await this.budgetSchemaRepository.findOne({ where: { id } });
      if (!budget) return Result.success(null);
      return Result.success(BudgetMapper.toEntity(budget));
    } catch (error) {
      return Result.failure("Falha ao buscar orçamento, erro: " + error?.message);
    }
  }

  async createEvent(data: Event): Promise<Result<Event>> {
    try {
      const created = this.eventSchemaRepository.create({
        companyId: data.companyId,
        name: data.name,
        createdAt: new Date(),
      });
      const saved = await this.eventSchemaRepository.save(created);
      return Result.success(
        new Event(saved.id, saved.companyId, saved.name, saved.createdAt, saved.updatedAt),
      );
    } catch (error) {
      return Result.failure("Falha ao criar evento, erro: " + error?.message);
    }
  }

  async updateEvent(data: Event): Promise<Result<Event>> {
    try {
      await this.eventSchemaRepository.save({
        id: data.id,
        companyId: data.companyId,
        name: data.name,
        createdAt: data.createdAt,
        updatedAt: new Date(),
      });
      return Result.success(data);
    } catch (error) {
      return Result.failure("Falha ao atualizar evento, erro: " + error?.message);
    }
  }

  async deleteEvent(id: string): Promise<Result<void>> {
    try {
      await this.eventSchemaRepository.delete({ id });
      return Result.success();
    } catch (error) {
      return Result.failure("Falha ao remover evento, erro: " + error?.message);
    }
  }

  async getEventById(id: string): Promise<Result<Event | null>> {
    try {
      const event = await this.eventSchemaRepository.findOne({ where: { id } });
      if (!event) return Result.success(null);
      return Result.success(
        new Event(event.id, event.companyId, event.name, event.createdAt, event.updatedAt),
      );
    } catch (error) {
      return Result.failure("Falha ao buscar evento, erro: " + error?.message);
    }
  }

  async createCategory(data: BudgetCategory): Promise<Result<BudgetCategory>> {
    try {
      const saved = await this.budgetCategorySchemaRepository.save({
        budgetId: data.budgetId,
        name: data.name,
        code: data.code,
        order: data.order,
      });
      return Result.success(
        new BudgetCategory(saved.id, saved.budgetId, saved.name, saved.code, saved.order),
      );
    } catch (error) {
      return Result.failure("Falha ao criar categoria, erro: " + error?.message);
    }
  }

  async updateCategory(data: BudgetCategory): Promise<Result<BudgetCategory>> {
    try {
      const saved = await this.budgetCategorySchemaRepository.save({
        id: data.id,
        budgetId: data.budgetId,
        name: data.name,
        code: data.code,
        order: data.order,
      });
      return Result.success(
        new BudgetCategory(saved.id, saved.budgetId, saved.name, saved.code, saved.order),
      );
    } catch (error) {
      return Result.failure("Falha ao atualizar categoria, erro: " + error?.message);
    }
  }

  async deleteCategory(id: string): Promise<Result<void>> {
    try {
      await this.budgetCategorySchemaRepository.delete({ id });
      return Result.success();
    } catch (error) {
      return Result.failure("Falha ao remover categoria, erro: " + error?.message);
    }
  }

  async createCompany(data: Company): Promise<Result<Company>> {
    try {
      const saved = await this.companySchemaRepository.save({
        name: data.name,
        createdAt: new Date(),
      });
      return Result.success(
        new Company(saved.id, saved.name, saved.createdAt, saved.updatedAt),
      );
    } catch (error) {
      return Result.failure("Falha ao criar empresa, erro: " + error?.message);
    }
  }

  async updateCompany(data: Company): Promise<Result<Company>> {
    try {
      const saved = await this.companySchemaRepository.save({
        id: data.id,
        name: data.name,
        createdAt: data.createdAt,
        updatedAt: new Date(),
      });
      return Result.success(
        new Company(saved.id, saved.name, saved.createdAt, saved.updatedAt),
      );
    } catch (error) {
      return Result.failure("Falha ao atualizar empresa, erro: " + error?.message);
    }
  }

  async deleteCompany(id: string): Promise<Result<void>> {
    try {
      await this.companySchemaRepository.delete({ id });
      return Result.success();
    } catch (error) {
      return Result.failure("Falha ao remover empresa, erro: " + error?.message);
    }
  }

  async getCompanyById(id: string): Promise<Result<Company | null>> {
    try {
      const company = await this.companySchemaRepository.findOne({ where: { id } });
      if (!company) return Result.success(null);
      return Result.success(
        new Company(company.id, company.name, company.createdAt, company.updatedAt),
      );
    } catch (error) {
      return Result.failure("Falha ao buscar empresa, erro: " + error?.message);
    }
  }
}
