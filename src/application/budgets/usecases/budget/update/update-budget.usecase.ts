import { Inject, Injectable } from "@nestjs/common";
import { Result } from "@shared/result";
import { Budget } from "@domain/budgets/entities/budget.entity";
import { BudgetCategory } from "@domain/budgets/entities/budget-category.entity";
import { BudgetLineItem } from "@domain/budgets/entities/budget-line-item.entity";
import { BillingType } from "@domain/budgets/types/billing-type.type";
import type { IBudgetRepository } from "@domain/budgets/repositories/budget/i-budget-repository";
import { updateBudgetSchema } from "./update-budget.dto";
import { ZError } from "@utils/index";

@Injectable()
export class UpdateBudgetUseCase {
  constructor(
    @Inject("IBudgetRepository")
    private readonly budgetRepository: IBudgetRepository,
  ) {}

  async execute(input: unknown) {
    const parsed = updateBudgetSchema.safeParse(input);

    if (!parsed.success) {
      const errors = ZError.create(parsed.error).errors;
      return Result.failure(errors[0] ?? "Dados inválidos");
    }

    const current = await this.budgetRepository.getById(parsed.data.id);
    if (current.isFailure()) return Result.failure(current.getError());
    if (!current.getValue()) return Result.failure("Orçamento não encontrado");

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
          parsed.data.id,
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

    const entity = Budget.read({
      id: parsed.data.id,
      eventId: parsed.data.eventId,
      client: parsed.data.client,
      job: parsed.data.job,
      deadline: parsed.data.deadline,
      location: parsed.data.location,
      eventDate: parsed.data.eventDate,
      participants: parsed.data.participants,
      categories,
      items,
      createdAt: current.getValue()!.createdAt,
      updatedAt: new Date(),
    });

    return this.budgetRepository.update(entity);
  }
}
