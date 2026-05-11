import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BudgetCategory } from "@domain/budgets/entities/budget-category.entity";
import { BudgetCategoryLink } from "@domain/budgets/entities/budget-category-link.entity";
import { BudgetLineItem } from "@domain/budgets/entities/budget-line-item.entity";
import { CompanyEvent } from "@domain/budgets/entities/company-event.entity";
import { EventBudget } from "@domain/budgets/entities/event-budget.entity";
import { BillingType } from "@domain/budgets/types/billing-type.type";
import type { IBudgetRelationRepository } from "@domain/budgets/repositories/relation/i-budget-relation-repository";
import { Result } from "@shared/result";
import { Repository } from "typeorm";
import { BudgetCategoryLinkSchema } from "@infra/database/typeorm/schemas/budget-category-link.schema";
import { BudgetLineItemSchema } from "@infra/database/typeorm/schemas/budget-line-item.schema";
import { CompanyEventSchema } from "@infra/database/typeorm/schemas/company-event.schema";
import { EventBudgetSchema } from "@infra/database/typeorm/schemas/event-budget.schema";

@Injectable()
export class BudgetRelationRepository implements IBudgetRelationRepository {
  constructor(
    @InjectRepository(CompanyEventSchema)
    private readonly companyEventSchemaRepository: Repository<CompanyEventSchema>,
    @InjectRepository(EventBudgetSchema)
    private readonly eventBudgetSchemaRepository: Repository<EventBudgetSchema>,
    @InjectRepository(BudgetCategoryLinkSchema)
    private readonly budgetCategoryLinkSchemaRepository: Repository<BudgetCategoryLinkSchema>,
    @InjectRepository(BudgetLineItemSchema)
    private readonly budgetLineItemSchemaRepository: Repository<BudgetLineItemSchema>,
  ) {}

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

  async replaceCompanyEvent(data: CompanyEvent): Promise<Result<CompanyEvent>> {
    await this.companyEventSchemaRepository.delete({ eventId: data.eventId });
    return this.createCompanyEvent(data);
  }

  async replaceEventBudget(data: EventBudget): Promise<Result<EventBudget>> {
    await this.eventBudgetSchemaRepository.delete({ budgetId: data.budgetId });
    return this.createEventBudget(data);
  }

  async replaceBudgetCategoryLinks(
    budgetId: string,
    categories: BudgetCategory[],
  ): Promise<Result<void>> {
    try {
      await this.budgetCategoryLinkSchemaRepository.delete({ budgetId });

      if (categories.length > 0) {
        await this.budgetCategoryLinkSchemaRepository.save(
          categories.map(
            (category) => new BudgetCategoryLink(budgetId, category.id),
          ),
        );
      }

      return Result.success();
    } catch (error) {
      return Result.failure(
        "Falha ao substituir categorias do orçamento, erro: " + error,
      );
    }
  }

  async replaceBudgetLineItems(
    budgetId: string,
    items: BudgetLineItem[],
  ): Promise<Result<void>> {
    try {
      await this.budgetLineItemSchemaRepository.delete({ budgetId });

      if (items.length > 0) {
        await this.budgetLineItemSchemaRepository.save(
          items.map((item) => ({
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

      return Result.success();
    } catch (error) {
      return Result.failure(
        "Falha ao substituir linhas do orçamento, erro: " + error,
      );
    }
  }

  async getCompanyIdByEventId(eventId: string): Promise<Result<string | null>> {
    try {
      const companyEvent = await this.companyEventSchemaRepository.findOne({
        where: { eventId },
      });

      return Result.success(companyEvent?.companyId ?? null);
    } catch (error) {
      return Result.failure("Falha ao buscar vínculo do evento, erro: " + error);
    }
  }

  async getEventIdByBudgetId(budgetId: string): Promise<Result<string | null>> {
    try {
      const eventBudget = await this.eventBudgetSchemaRepository.findOne({
        where: { budgetId },
      });

      return Result.success(eventBudget?.eventId ?? null);
    } catch (error) {
      return Result.failure(
        "Falha ao buscar vínculo do orçamento, erro: " + error,
      );
    }
  }

  async getCategoriesByBudgetId(
    budgetId: string,
  ): Promise<Result<BudgetCategory[]>> {
    try {
      const links = await this.budgetCategoryLinkSchemaRepository.find({
        where: { budgetId },
        relations: { category: true },
      });

      return Result.success(
        links
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
      );
    } catch (error) {
      return Result.failure(
        "Falha ao buscar categorias do orçamento, erro: " + error,
      );
    }
  }

  async getLineItemsByBudgetId(
    budgetId: string,
  ): Promise<Result<BudgetLineItem[]>> {
    try {
      const items = await this.budgetLineItemSchemaRepository.find({
        where: { budgetId },
        order: { order: "ASC" },
      });

      return Result.success(
        items.map(
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
      );
    } catch (error) {
      return Result.failure(
        "Falha ao buscar linhas do orçamento, erro: " + error,
      );
    }
  }
}
