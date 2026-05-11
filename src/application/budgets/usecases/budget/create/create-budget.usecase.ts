import { Inject, Injectable } from "@nestjs/common";
import { Result } from "@shared/result";
import { Budget } from "@domain/budgets/entities/budget.entity";
import { BudgetCategory } from "@domain/budgets/entities/budget-category.entity";
import { BudgetLineItem } from "@domain/budgets/entities/budget-line-item.entity";
import { BillingType } from "@domain/budgets/types/billing-type.type";
import type { IBudgetRepository } from "@domain/budgets/repositories/i-budget-repository";
import { createBudgetSchema } from "./create-budget.dto";
import { ZError } from "@utils/index";

@Injectable()
export class CreateBudgetUseCase {
  constructor(
    @Inject("IBudgetRepository")
    private readonly budgetRepository: IBudgetRepository,
  ) {}

  async execute(input: unknown) {
    const parsed = createBudgetSchema.safeParse(input);

    if (!parsed.success) {
      const errors = ZError.create(parsed.error).errors;
      return Result.failure(errors[0] ?? "Dados inválidos");
    }

    const categories = parsed.data.categories.map(
      (category) =>
        new BudgetCategory(
          category.id,
          category.name,
          category.code,
          category.order,
        ),
    );

    const items = parsed.data.items.map(
      (item) =>
        new BudgetLineItem(
          item.id,
          "",
          item.categoryId,
          item.parentId ?? null,
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
    );

    const budgetResult = Budget.create({
      ...parsed.data,
      categories,
      items,
    });

    if (budgetResult.isFailure()) {
      return Result.failure(budgetResult.getError());
    }

    return this.budgetRepository.create(budgetResult.getValue());
  }
}
