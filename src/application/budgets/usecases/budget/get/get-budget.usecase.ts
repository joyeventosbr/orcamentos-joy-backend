import { Inject, Injectable } from "@nestjs/common";
import { BudgetDetail } from "@domain/budgets/entities/budget-detail.entity";
import { BudgetLineItem } from "@domain/budgets/entities/budget-line-item.entity";
import { BudgetTableCategory } from "@domain/budgets/entities/budget-table-category.entity";
import { BudgetTableRow } from "@domain/budgets/entities/budget-table-row.entity";
import type { IBudgetRepository } from "@domain/budgets/repositories/budget/i-budget-repository";
import { Result } from "@shared/result";
import { ZError } from "@utils/index";
import { getBudgetSchema } from "./get-budget.dto";

@Injectable()
export class GetBudgetUseCase {
  constructor(
    @Inject("IBudgetRepository")
    private readonly budgetRepository: IBudgetRepository,
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

    const categories = [...budget.categories].sort(
      (first, second) => first.order - second.order,
    );

    return Result.success(
      BudgetDetail.read({
        id: budget.id,
        folderId: budget.folderId,
        client: budget.client,
        job: budget.job,
        deadline: budget.deadline,
        location: budget.location,
        folderDate: budget.folderDate,
        participants: budget.participants,
        createdAt: budget.createdAt,
        updatedAt: budget.updatedAt,
        table: categories.map((category) =>
          BudgetTableCategory.read({
            category,
            rows: this.buildRowsTree(
              budget.items.filter((item) => item.categoryId === category.id),
            ),
          }),
        ),
      }),
    );
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
