import { Inject, Injectable } from "@nestjs/common";
import { BudgetCategory } from "@domain/budgets/entities/budget-category.entity";
import { BudgetDetail } from "@domain/budgets/entities/budget-detail.entity";
import { BudgetLineItem } from "@domain/budgets/entities/budget-line-item.entity";
import { BudgetTableCategory } from "@domain/budgets/entities/budget-table-category.entity";
import { BudgetTableRow } from "@domain/budgets/entities/budget-table-row.entity";
import type { IBudgetRepository } from "@domain/budgets/repositories/i-budget-repository";
import type { IBudgetCategoryRepository } from "@domain/budgets/repositories/i-budget-category-repository";
import type { IBudgetRelationRepository } from "@domain/budgets/repositories/i-budget-relation-repository";
import { Result } from "@shared/result";
import { ZError } from "@utils/index";
import { getBudgetSchema } from "./get-budget.dto";

@Injectable()
export class GetBudgetUseCase {
  constructor(
    @Inject("IBudgetRepository")
    private readonly budgetRepository: IBudgetRepository,
    @Inject("IBudgetRelationRepository")
    private readonly budgetRelationRepository: IBudgetRelationRepository,
    @Inject("IBudgetCategoryRepository")
    private readonly budgetCategoryRepository: IBudgetCategoryRepository,
  ) {}

  async execute(input: unknown): Promise<Result<BudgetDetail>> {
    const parsed = getBudgetSchema.safeParse(input);
    if (!parsed.success) {
      const errors = ZError.create(parsed.error).errors;
      return Result.failure(errors[0] ?? "Dados inválidos");
    }

    const budgetResult = await this.budgetRepository.getById(parsed.data.id);
    if (budgetResult.isFailure()) {
      return Result.failure(budgetResult.getError());
    }

    const budget = budgetResult.getValue();
    if (!budget) {
      return Result.failure("Orçamento não encontrado");
    }

    const itemsResult = await this.budgetRelationRepository.getLineItemsByBudgetId(
      budget.id,
    );
    if (itemsResult.isFailure()) return Result.failure(itemsResult.getError());

    const categoriesResult = await this.budgetCategoryRepository.getAll();
    if (categoriesResult.isFailure()) return Result.failure(categoriesResult.getError());

    const categoriesById = new Map(
      categoriesResult.getValue().map((category) => [category.id, category]),
    );
    const groupedItems = this.groupItemsByCategory(itemsResult.getValue());

    return Result.success(
      BudgetDetail.read({
        id: budget.id,
        customerId: budget.customerId,
        folderId: budget.folderId,
        jobDescription: budget.jobDescription,
        location: budget.location,
        eventDate: budget.eventDate,
        paymentTerm: budget.paymentTerm,
        createdAt: budget.createdAt,
        updatedAt: budget.updatedAt,
        table: [...groupedItems.entries()]
          .map(([categoryId, items]) =>
            BudgetTableCategory.read({
              category:
                categoriesById.get(categoryId) ??
                BudgetCategory.read({
                  id: categoryId,
                  name: "",
                  code: "",
                  order: Number.MAX_SAFE_INTEGER,
                }),
              rows: this.buildRowsTree(items),
            }),
          )
          .sort(
            (first, second) => first.category.order - second.category.order,
          ),
      }),
    );
  }

  private groupItemsByCategory(
    items: BudgetLineItem[],
  ): Map<string, BudgetLineItem[]> {
    const grouped = new Map<string, BudgetLineItem[]>();

    for (const item of items) {
      grouped.set(item.categoryId, [
        ...(grouped.get(item.categoryId) ?? []),
        item,
      ]);
    }

    return grouped;
  }

  private buildRowsTree(items: BudgetLineItem[]): BudgetTableRow[] {
    const childrenByParentId = new Map<string, BudgetLineItem[]>();
    const itemsById = new Map(items.map((item) => [item.id, item]));

    for (const item of items) {
      const parentKey =
        item.parentId && itemsById.has(item.parentId) ? item.parentId : "";
      childrenByParentId.set(parentKey, [
        ...(childrenByParentId.get(parentKey) ?? []),
        item,
      ]);
    }

    const sortItems = (values: BudgetLineItem[]) =>
      values.sort((first, second) => {
        if (first.order !== second.order) return first.order - second.order;
        return first.name.localeCompare(second.name);
      });

    const toRow = (item: BudgetLineItem): BudgetTableRow =>
      BudgetTableRow.read({
        id: item.id,
        parentId: item.parentId,
        categoryId: item.categoryId,
        budgetId: item.budgetId,
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
        children: sortItems(childrenByParentId.get(item.id) ?? []).map(toRow),
      });

    return sortItems(childrenByParentId.get("") ?? []).map(toRow);
  }
}
