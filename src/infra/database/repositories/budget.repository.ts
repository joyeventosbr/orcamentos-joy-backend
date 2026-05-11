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
import { CompanyEventSchema } from "../typeorm/schemas/company-event.schema";
import { EventBudgetSchema } from "../typeorm/schemas/event-budget.schema";
import { BudgetCategoryLinkSchema } from "../typeorm/schemas/budget-category-link.schema";
import { BudgetLineItemSchema } from "../typeorm/schemas/budget-line-item.schema";
import { CompanyEvent } from "@domain/budgets/entities/company-event.entity";
import { EventBudget } from "@domain/budgets/entities/event-budget.entity";
import { BudgetCategoryLink } from "@domain/budgets/entities/budget-category-link.entity";
import { BudgetLineItem } from "@domain/budgets/entities/budget-line-item.entity";
import { BillingType } from "@domain/budgets/types/billing-type.type";

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
    @InjectRepository(CompanyEventSchema)
    private readonly companyEventSchemaRepository: Repository<CompanyEventSchema>,
    @InjectRepository(EventBudgetSchema)
    private readonly eventBudgetSchemaRepository: Repository<EventBudgetSchema>,
    @InjectRepository(BudgetCategoryLinkSchema)
    private readonly budgetCategoryLinkSchemaRepository: Repository<BudgetCategoryLinkSchema>,
    @InjectRepository(BudgetLineItemSchema)
    private readonly budgetLineItemSchemaRepository: Repository<BudgetLineItemSchema>,
  ) {}

  async create(data: Budget): Promise<Result<Budget>> {
    try {
      const schema = this.budgetSchemaRepository.create({
        ...BudgetMapper.toSchema(data),
        createdAt: new Date(),
      });

      const saved = await this.budgetSchemaRepository.save(schema);
      const eventBudgetResult = await this.createEventBudget(
        new EventBudget(data.eventId, saved.id),
      );
      if (eventBudgetResult.isFailure()) {
        return Result.failure(eventBudgetResult.getError());
      }

      await this.saveBudgetCategoryLinks(saved.id, data.categories);
      await this.saveBudgetLineItems(saved.id, data);

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

      await this.eventBudgetSchemaRepository.delete({ budgetId: data.id });
      const eventBudgetResult = await this.createEventBudget(
        new EventBudget(data.eventId, data.id),
      );
      if (eventBudgetResult.isFailure()) {
        return Result.failure(eventBudgetResult.getError());
      }

      await this.saveBudgetCategoryLinks(data.id, data.categories);
      await this.budgetLineItemSchemaRepository.delete({ budgetId: data.id });
      await this.saveBudgetLineItems(data.id, data);

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
      const budget = await this.getHydratedBudget(id);
      if (!budget) return Result.success(null);
      return Result.success(budget);
    } catch (error) {
      return Result.failure("Falha ao buscar orçamento, erro: " + error);
    }
  }

  async createEvent(data: Event): Promise<Result<Event>> {
    try {
      const created = this.eventSchemaRepository.create({
        name: data.name,
        createdAt: new Date(),
      });
      const saved = await this.eventSchemaRepository.save(created);
      const companyEventResult = await this.createCompanyEvent(
        new CompanyEvent(data.companyId, saved.id),
      );
      if (companyEventResult.isFailure()) {
        return Result.failure(companyEventResult.getError());
      }

      return Result.success(
        new Event(
          saved.id,
          data.companyId,
          saved.name,
          saved.createdAt,
          saved.updatedAt,
        ),
      );
    } catch (error) {
      return Result.failure("Falha ao criar evento, erro: " + error);
    }
  }

  async updateEvent(data: Event): Promise<Result<Event>> {
    try {
      await this.eventSchemaRepository.save({
        id: data.id,
        name: data.name,
        createdAt: data.createdAt,
        updatedAt: new Date(),
      });
      await this.companyEventSchemaRepository.delete({ eventId: data.id });
      const companyEventResult = await this.createCompanyEvent(
        new CompanyEvent(data.companyId, data.id),
      );
      if (companyEventResult.isFailure()) {
        return Result.failure(companyEventResult.getError());
      }

      return Result.success(data);
    } catch (error) {
      return Result.failure("Falha ao atualizar evento, erro: " + error);
    }
  }

  async deleteEvent(id: string): Promise<Result<void>> {
    try {
      await this.eventSchemaRepository.delete({ id });
      return Result.success();
    } catch (error) {
      return Result.failure("Falha ao remover evento, erro: " + error);
    }
  }

  async getEventById(id: string): Promise<Result<Event | null>> {
    try {
      const event = await this.eventSchemaRepository.findOne({ where: { id } });
      if (!event) return Result.success(null);
      const companyEvent = await this.companyEventSchemaRepository.findOne({
        where: { eventId: id },
      });

      return Result.success(
        new Event(
          event.id,
          companyEvent?.companyId ?? "",
          event.name,
          event.createdAt,
          event.updatedAt,
        ),
      );
    } catch (error) {
      return Result.failure("Falha ao buscar evento, erro: " + error);
    }
  }

  async createCategory(data: BudgetCategory): Promise<Result<BudgetCategory>> {
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

  async updateCategory(data: BudgetCategory): Promise<Result<BudgetCategory>> {
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

  async deleteCategory(id: string): Promise<Result<void>> {
    try {
      await this.budgetCategorySchemaRepository.delete({ id });
      return Result.success();
    } catch (error) {
      return Result.failure("Falha ao remover categoria, erro: " + error);
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
      return Result.failure("Falha ao criar empresa, erro: " + error);
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
      return Result.failure("Falha ao atualizar empresa, erro: " + error);
    }
  }

  async deleteCompany(id: string): Promise<Result<void>> {
    try {
      await this.companySchemaRepository.delete({ id });
      return Result.success();
    } catch (error) {
      return Result.failure("Falha ao remover empresa, erro: " + error);
    }
  }

  async getCompanyById(id: string): Promise<Result<Company | null>> {
    try {
      const company = await this.companySchemaRepository.findOne({
        where: { id },
      });
      if (!company) return Result.success(null);
      return Result.success(
        new Company(
          company.id,
          company.name,
          company.createdAt,
          company.updatedAt,
        ),
      );
    } catch (error) {
      return Result.failure("Falha ao buscar empresa, erro: " + error);
    }
  }

  private async getHydratedBudget(id: string): Promise<Budget | null> {
    const budget = await this.budgetSchemaRepository.findOne({ where: { id } });
    if (!budget) {
      return null;
    }

    const eventBudget = await this.eventBudgetSchemaRepository.findOne({
      where: { budgetId: id },
    });
    const categoryLinks = await this.budgetCategoryLinkSchemaRepository.find({
      where: { budgetId: id },
      relations: { category: true },
    });
    const items = await this.budgetLineItemSchemaRepository.find({
      where: { budgetId: id },
      order: { order: "ASC" },
    });

    return Budget.read({
      id: budget.id,
      eventId: eventBudget?.eventId ?? "",
      client: budget.client,
      job: budget.job,
      deadline: budget.deadline,
      location: budget.location,
      eventDate: budget.eventDate,
      participants: budget.participants,
      categories: categoryLinks
        .filter((link) => Boolean(link.category))
        .map(
          (link) =>
            new BudgetCategory(
              link.category.id,
              link.category.name,
              link.category.code,
              link.category.order,
            ),
        ),
      items: items.map(
        (item) =>
          new BudgetLineItem(
            item.id,
            item.budgetId,
            item.categoryId,
            item.parentId,
            item.order,
            item.name,
            item.description,
            item.billingType as BillingType,
            item.quantity,
            item.dailyRates,
            item.unitValue,
            item.totalValue,
            item.upfrontPayment,
            item.installment30Days,
            item.installment45Days,
            item.installment60Days,
            item.installment90Days,
            item.installment120Days,
            item.billingUnitValue,
            item.billingTotalValue,
          ),
      ),
      createdAt: budget.createdAt,
      updatedAt: budget.updatedAt,
    });
  }

  private async saveBudgetCategoryLinks(
    budgetId: string,
    categories: BudgetCategory[],
  ): Promise<void> {
    await this.budgetCategoryLinkSchemaRepository.delete({ budgetId });

    if (categories.length === 0) {
      return;
    }

    await this.budgetCategoryLinkSchemaRepository.save(
      categories.map(
        (category) => new BudgetCategoryLink(budgetId, category.id),
      ),
    );
  }

  async createCompanyEvent(data: CompanyEvent): Promise<Result<CompanyEvent>> {
    try {
      const saved = await this.companyEventSchemaRepository.save({
        companyId: data.companyId,
        eventId: data.eventId,
      });

      return Result.success(new CompanyEvent(saved.companyId, saved.eventId));
    } catch (error) {
      return Result.failure(
        "Falha ao vincular empresa e evento, erro: " + error,
      );
    }
  }

  async createEventBudget(data: EventBudget): Promise<Result<EventBudget>> {
    try {
      const saved = await this.eventBudgetSchemaRepository.save({
        eventId: data.eventId,
        budgetId: data.budgetId,
      });

      return Result.success(new EventBudget(saved.eventId, saved.budgetId));
    } catch (error) {
      return Result.failure(
        "Falha ao vincular evento e orçamento, erro: " + error,
      );
    }
  }

  async createBudgetCategoryLink(
    data: BudgetCategoryLink,
  ): Promise<Result<BudgetCategoryLink>> {
    try {
      const saved = await this.budgetCategoryLinkSchemaRepository.save({
        budgetId: data.budgetId,
        categoryId: data.categoryId,
      });

      return Result.success(
        new BudgetCategoryLink(saved.budgetId, saved.categoryId),
      );
    } catch (error) {
      return Result.failure(
        "Falha ao vincular orçamento e categoria, erro: " + error,
      );
    }
  }

  private async saveBudgetLineItems(
    budgetId: string,
    data: Budget,
  ): Promise<void> {
    if (data.items.length === 0) {
      return;
    }

    await this.budgetLineItemSchemaRepository.save(
      data.items.map((item) => ({
        id: item.id || undefined,
        budgetId,
        categoryId: item.categoryId,
        parentId: item.parentId,
        order: item.order,
        name: item.name,
        description: item.description,
        billingType: item.billingType,
        quantity: item.quantity,
        dailyRates: item.dailyRates,
        unitValue: item.unitValue,
        totalValue: item.totalValue,
        upfrontPayment: item.upfrontPayment,
        installment30Days: item.installment30Days,
        installment45Days: item.installment45Days,
        installment60Days: item.installment60Days,
        installment90Days: item.installment90Days,
        installment120Days: item.installment120Days,
        billingUnitValue: item.billingUnitValue,
        billingTotalValue: item.billingTotalValue,
      })),
    );
  }
}
