import { Inject, Injectable } from "@nestjs/common";
import { BudgetLine } from "@domain/budgets/entities/budget-line.entity";
import type { IBudgetLineRepository } from "@domain/budgets/repositories/i-budget-line-repository";
import type { IBudgetRepository } from "@domain/budgets/repositories/i-budget-repository";
import { Result } from "@shared/result";
import { ZError } from "@utils/index";
import { bulkUpdateBudgetLinesSchema } from "./bulk-update-budget-lines.dto";

@Injectable()
export class BulkUpdateBudgetLinesUseCase {
  constructor(
    @Inject("IBudgetLineRepository")
    private readonly budgetLineRepository: IBudgetLineRepository,
    @Inject("IBudgetRepository")
    private readonly budgetRepository: IBudgetRepository,
  ) {}

  async execute(input: unknown): Promise<Result<BudgetLine[]>> {
    const parsed = bulkUpdateBudgetLinesSchema.safeParse(input);

    if (!parsed.success) {
      const errors = ZError.create(parsed.error).errors;
      return Result.failure(errors[0] ?? "Dados inválidos");
    }

    const deleteIds = parsed.data.delete ?? [];

    const duplicateIdsResult = this.validateDuplicatedIds(
      (parsed.data.update ?? []).map((line) => line.id),
      deleteIds,
    );
    if (duplicateIdsResult.isFailure()) {
      return Result.failure(duplicateIdsResult.getError());
    }

    const linesToCreate: BudgetLine[] = [];
    for (const line of parsed.data.create ?? []) {
      if (line.budgetId !== parsed.data.budgetId) {
        return Result.failure("Linha não pertence ao orçamento informado");
      }

      const lineResult = BudgetLine.create(line);
      if (lineResult.isFailure()) return Result.failure(lineResult.getError());

      linesToCreate.push(lineResult.getValue());
    }

    const linesToUpdate: BudgetLine[] = [];
    for (const line of parsed.data.update ?? []) {
      const current = await this.budgetLineRepository.getById(line.id);
      if (current.isFailure()) return Result.failure(current.getError());

      const budgetLine = current.getValue();
      if (!budgetLine) {
        return Result.failure("Linha do orçamento não encontrada");
      }
      if (budgetLine.budgetId !== parsed.data.budgetId) {
        return Result.failure("Linha não pertence ao orçamento informado");
      }

      const updated = budgetLine.update({
        categoryCode: line.categoryCode,
        parentId: line.parentId,
        order: line.order,
        name: line.name,
        description: line.description,
        billingType: line.billingType,
        quantity: line.quantity,
        dailyRates: line.dailyRates,
        unitValue: line.unitValue,
        totalValue: line.totalValue,
        upfrontPayment: line.upfrontPayment,
        installment30Days: line.installment30Days,
        installment45Days: line.installment45Days,
        installment60Days: line.installment60Days,
        installment90Days: line.installment90Days,
        installment120Days: line.installment120Days,
        billingUnitValue: line.billingUnitValue,
        billingTotalValue: line.billingTotalValue,
        supplier: line.supplier,
        supplierValue: line.supplierValue,
        percentBv: line.percentBv,
        percentNfOver: line.percentNfOver,
      });
      if (updated.isFailure()) return Result.failure(updated.getError());

      linesToUpdate.push(updated.getValue());
    }

    for (const id of deleteIds) {
      const current = await this.budgetLineRepository.getById(id);
      if (current.isFailure()) return Result.failure(current.getError());
      const budgetLine = current.getValue();
      if (!budgetLine) {
        return Result.failure("Linha do orçamento não encontrada");
      }
      if (budgetLine.budgetId !== parsed.data.budgetId) {
        return Result.failure("Linha não pertence ao orçamento informado");
      }
    }

    const saved = await this.budgetLineRepository.bulkSave({
      create: linesToCreate,
      update: linesToUpdate,
      deleteIds,
    });
    if (saved.isFailure()) return Result.failure(saved.getError());

    const hasChanges =
      linesToCreate.length > 0 ||
      linesToUpdate.length > 0 ||
      deleteIds.length > 0;
    if (!hasChanges) return saved;

    const budgetId = parsed.data.budgetId;
    const updatedBy = parsed.data.updatedBy;
    const budgetResult = await this.budgetRepository.getById(budgetId);
    if (budgetResult.isFailure())
      return Result.failure(budgetResult.getError());

    const budget = budgetResult.getValue();
    if (!budget) return Result.failure("Orçamento não encontrado");

    const updated = budget.markUpdatedBy(updatedBy);
    if (updated.isFailure()) return Result.failure(updated.getError());

    const savedUpdate = await this.budgetRepository.updateAudit(budget);
    if (savedUpdate.isFailure()) {
      return Result.failure(savedUpdate.getError());
    }

    return Result.success(saved.getValue());
  }

  private validateDuplicatedIds(
    updateIds: string[],
    deleteIds: string[],
  ): Result<void> {
    const allIds = [...updateIds, ...deleteIds];
    const uniqueIds = new Set(allIds);
    if (uniqueIds.size !== allIds.length) {
      return Result.failure(
        "A mesma linha não pode ser editada ou removida mais de uma vez",
      );
    }

    return Result.success();
  }
}
