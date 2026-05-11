import { Budget } from "@domain/budgets/entities/budget.entity";
import { BudgetCategory } from "@domain/budgets/entities/budget-category.entity";
import { BudgetLineItem } from "@domain/budgets/entities/budget-line-item.entity";
import { BillingType } from "@domain/budgets/types/billing-type.type";
import { BudgetSchema } from "../typeorm/schemas/budget.schema";
import { BudgetCategorySchema } from "../typeorm/schemas/budget-category.schema";
import { BudgetLineItemSchema } from "../typeorm/schemas/budget-line-item.schema";

export class BudgetMapper {
  static toEntity(schema: BudgetSchema): Budget {
    return Budget.read({
      id: schema.id,
      eventId: schema.eventId,
      client: schema.client,
      job: schema.job,
      deadline: schema.deadline,
      location: schema.location,
      eventDate: schema.eventDate,
      participants: schema.participants,
      categories: (schema.categories ?? []).map(
        (category) =>
          new BudgetCategory(
            category.id,
            category.budgetId,
            category.name,
            category.code,
            category.order,
          ),
      ),
      items: (schema.items ?? []).map(
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
      createdAt: schema.createdAt,
      updatedAt: schema.updatedAt,
    });
  }

  static toSchema(entity: Budget): Partial<BudgetSchema> {
    return {
      id: entity.id || undefined,
      eventId: entity.eventId,
      client: entity.client,
      job: entity.job,
      deadline: entity.deadline,
      location: entity.location,
      eventDate: entity.eventDate,
      participants: entity.participants,
      categories: entity.categories.map(
        (category) =>
          ({
            id: category.id,
            budgetId: entity.id,
            name: category.name,
            code: category.code,
            order: category.order,
          }) as BudgetCategorySchema,
      ),
      items: entity.items.map(
        (item) =>
          ({
            id: item.id,
            budgetId: entity.id,
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
          }) as BudgetLineItemSchema,
      ),
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
