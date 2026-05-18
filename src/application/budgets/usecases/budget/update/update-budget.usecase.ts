import { Inject, Injectable } from "@nestjs/common";
import { Result } from "@shared/result";
import { Budget } from "@domain/budgets/entities/budget.entity";
import { BudgetLineItem } from "@domain/budgets/entities/budget-line-item.entity";
import { BillingType } from "@domain/budgets/enums/billing-type.enum";
import type { IBudgetRepository } from "@domain/budgets/repositories/i-budget-repository";
import { updateBudgetSchema, type UpdateBudgetDto } from "./update-budget.dto";
import { ZError } from "@utils/index";

@Injectable()
export class UpdateBudgetUseCase {
  constructor(
    @Inject("IBudgetRepository")
    private readonly budgetRepository: IBudgetRepository,
  ) {}

  async execute(input: unknown): Promise<Result<Budget>> {
    const parsed = updateBudgetSchema.safeParse(input);

    if (!parsed.success) {
      const errors = ZError.create(parsed.error).errors;
      return Result.failure(errors[0] ?? "Dados inválidos");
    }

    const current = await this.budgetRepository.getById(parsed.data.id);
    if (current.isFailure()) return Result.failure(current.getError());
    const budget = current.getValue();
    if (!budget) return Result.failure("Orçamento não encontrado");

    let items: BudgetLineItem[] | undefined;
    if (parsed.data.items !== undefined) {
      const itemsResult = this.createItems(parsed.data.id, parsed.data.items);
      if (itemsResult.isFailure()) {
        return Result.failure(itemsResult.getError());
      }

      items = itemsResult.getValue();
    }

    const budgetResult = budget.update({
      customerId: parsed.data.customerId,
      folderId: parsed.data.folderId,
      jobDescription: parsed.data.jobDescription,
      location: parsed.data.location,
      eventDate: parsed.data.eventDate,
      paymentTerm: parsed.data.paymentTerm,
    });
    if (budgetResult.isFailure()) {
      return Result.failure(budgetResult.getError());
    }

    return this.budgetRepository.update(budgetResult.getValue(), items);
  }

  private createItems(
    budgetId: string,
    items: NonNullable<UpdateBudgetDto["items"]>,
  ): Result<BudgetLineItem[]> {
    const lineItems: BudgetLineItem[] = [];

    for (const item of items) {
      const itemResult = BudgetLineItem.create({
        ...item,
        budgetId,
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
