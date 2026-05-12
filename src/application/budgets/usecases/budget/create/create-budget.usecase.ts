import { Inject, Injectable } from "@nestjs/common";
import { Result } from "@shared/result";
import { Budget } from "@domain/budgets/entities/budget.entity";
import { BudgetCategory } from "@domain/budgets/entities/budget-category.entity";
import { BudgetLineItem } from "@domain/budgets/entities/budget-line-item.entity";
import { BillingType } from "@domain/budgets/types/billing-type.type";
import type { IBudgetRepository } from "@domain/budgets/repositories/budget/i-budget-repository";
import { createBudgetSchema, type CreateBudgetDto } from "./create-budget.dto";
import { ZError } from "@utils/index";

@Injectable()
export class CreateBudgetUseCase {
  constructor(
    @Inject("IBudgetRepository")
    private readonly budgetRepository: IBudgetRepository,
  ) {}

  async execute(input: unknown): Promise<Result<Budget>> {
    const parsed = createBudgetSchema.safeParse(input);

    if (!parsed.success) {
      const errors = ZError.create(parsed.error).errors;
      return Result.failure(errors[0] ?? "Dados inválidos");
    }

    const itemsResult = this.createItems(parsed.data.items);
    if (itemsResult.isFailure()) {
      return Result.failure(itemsResult.getError());
    }
    const items = itemsResult.getValue();

    const budgetResult = Budget.create({
      ...parsed.data,
      categories: this.getCategoriesFromItems(items),
      items,
    });

    if (budgetResult.isFailure()) {
      return Result.failure(budgetResult.getError());
    }

    return this.budgetRepository.create(budgetResult.getValue());
  }

  private getCategoriesFromItems(items: BudgetLineItem[]): BudgetCategory[] {
    const categoryIds = [...new Set(items.map((item) => item.categoryId))];

    return categoryIds.map((categoryId, index) =>
      BudgetCategory.read({ id: categoryId, name: "", code: "", order: index }),
    );
  }

  private createItems(
    items: CreateBudgetDto["items"],
  ): Result<BudgetLineItem[]> {
    const lineItems: BudgetLineItem[] = [];

    for (const item of items) {
      const itemResult = BudgetLineItem.create({
        ...item,
        budgetId: "",
        parentId: item.parentId ?? null,
        billingType: item.billingType as BillingType,
      });
      if (itemResult.isFailure()) {
        return Result.failure(itemResult.getError());
      }

      lineItems.push(itemResult.getValue());
    }

    return Result.success(lineItems);
  }
}
