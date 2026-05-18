import { Inject, Injectable } from "@nestjs/common";
import { BudgetLine } from "@domain/budgets/entities/budget-line.entity";
import type { IBudgetLineRepository } from "@domain/budgets/repositories/i-budget-line-repository";
import { Result } from "@shared/result";
import { ZError } from "@utils/index";
import { updateBudgetLineSchema } from "./update-budget-line.dto";

@Injectable()
export class UpdateBudgetLineUseCase {
  constructor(
    @Inject("IBudgetLineRepository")
    private readonly budgetLineRepository: IBudgetLineRepository,
  ) {}

  async execute(input: unknown): Promise<Result<BudgetLine>> {
    const parsed = updateBudgetLineSchema.safeParse(input);

    if (!parsed.success) {
      const errors = ZError.create(parsed.error).errors;
      return Result.failure(errors[0] ?? "Dados inválidos");
    }

    const current = await this.budgetLineRepository.getById(parsed.data.id);
    if (current.isFailure()) return Result.failure(current.getError());
    const line = current.getValue();
    if (!line) return Result.failure("Linha do orçamento não encontrada");

    const lineResult = line.update({
      categoryId: parsed.data.categoryId,
      parentId: parsed.data.parentId,
      order: parsed.data.order,
      name: parsed.data.name,
      description: parsed.data.description,
      billingType: parsed.data.billingType,
      quantity: parsed.data.quantity,
      dailyRates: parsed.data.dailyRates,
      unitValue: parsed.data.unitValue,
      totalValue: parsed.data.totalValue,
      upfrontPayment: parsed.data.upfrontPayment,
      installment30Days: parsed.data.installment30Days,
      installment45Days: parsed.data.installment45Days,
      installment60Days: parsed.data.installment60Days,
      installment90Days: parsed.data.installment90Days,
      installment120Days: parsed.data.installment120Days,
      billingUnitValue: parsed.data.billingUnitValue,
      billingTotalValue: parsed.data.billingTotalValue,
    });
    if (lineResult.isFailure()) return Result.failure(lineResult.getError());

    return this.budgetLineRepository.update(lineResult.getValue());
  }
}
