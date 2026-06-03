import { Inject, Injectable } from "@nestjs/common";
import { Budget } from "@domain/budgets/entities/budget.entity";
import { BudgetLine } from "@domain/budgets/entities/budget-line.entity";
import { FolderBudget } from "@domain/budgets/entities/folder-budget.entity";
import type { IBudgetRepository } from "@domain/budgets/repositories/i-budget-repository";
import type { IBudgetLineRepository } from "@domain/budgets/repositories/i-budget-line-repository";
import type { IBudgetRelationRepository } from "@domain/budgets/repositories/i-budget-relation-repository";
import { BudgetStatus } from "@domain/budgets/enums/budget-status.enum";
import { Result } from "@shared/result";
import { ZError } from "@utils/index";
import { copyBudgetSchema } from "./copy-budget.dto";

@Injectable()
export class CopyBudgetUseCase {
  constructor(
    @Inject("IBudgetRepository")
    private readonly budgetRepository: IBudgetRepository,
    @Inject("IBudgetLineRepository")
    private readonly budgetLineRepository: IBudgetLineRepository,
    @Inject("IBudgetRelationRepository")
    private readonly budgetRelationRepository: IBudgetRelationRepository,
  ) {}

  async execute(input: unknown): Promise<Result<Budget>> {
    const parsed = copyBudgetSchema.safeParse(input);

    if (!parsed.success) {
      const errors = ZError.create(parsed.error).errors;
      return Result.failure(errors[0] ?? "Dados inválidos");
    }

    const current = await this.budgetRepository.getById(parsed.data.id);
    if (current.isFailure()) return Result.failure(current.getError());

    const budget = current.getValue();
    if (!budget) return Result.failure("Orçamento não encontrado");

    if (this.isApprovedStatus(budget.status)) {
      return Result.failure("Orçamento aprovado não pode ser duplicado");
    }

    const linesResult = await this.budgetLineRepository.getAllByBudgetId(
      budget.id,
    );
    if (linesResult.isFailure()) {
      return Result.failure(linesResult.getError());
    }

    const copy = Budget.create({
      name: budget.name,
      customerId: budget.customerId,
      folderId: budget.folderId,
      taxNf: budget.taxNf,
      createdBy: parsed.data.createdBy,
      version: 0,
      status: budget.status,
      parentId: null,
      jobDescription: budget.jobDescription,
      location: budget.location,
      eventDate: budget.eventDate,
      paymentTerm: budget.paymentTerm,
    });
    if (copy.isFailure()) {
      return Result.failure(copy.getError());
    }

    const createdCopy = await this.budgetRepository.create(copy.getValue());
    if (createdCopy.isFailure()) {
      return Result.failure(createdCopy.getError());
    }

    const folderBudget = FolderBudget.create({
      folderId: budget.folderId,
      budgetId: createdCopy.getValue().id,
    });
    if (folderBudget.isFailure()) {
      return Result.failure(folderBudget.getError());
    }

    const linkedFolderBudget =
      await this.budgetRelationRepository.createFolderBudget(
        folderBudget.getValue(),
      );
    if (linkedFolderBudget.isFailure()) {
      return Result.failure(linkedFolderBudget.getError());
    }

    const copiedLines = linesResult.getValue().map((line) =>
      BudgetLine.create({
        budgetId: createdCopy.getValue().id,
        categoryCode: line.categoryCode,
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
        supplierValue: line.supplierValue ?? undefined,
        percentBv: line.percentBv ?? undefined,
        percentNfBv: line.percentNfBv ?? undefined,
        bvValue: line.bvValue ?? undefined,
        percentNfOver: line.percentNfOver ?? undefined,
        overValue: line.overValue ?? undefined,
        realValue: line.realValue ?? undefined,
      }),
    );
    const invalidCopiedLine = copiedLines.find((line) => line.isFailure());
    if (invalidCopiedLine?.isFailure()) {
      return Result.failure(invalidCopiedLine.getError());
    }

    const savedCopiedLines = await this.budgetLineRepository.createMany(
      copiedLines.map((line) => line.getValue()),
    );
    if (savedCopiedLines.isFailure()) {
      return Result.failure(savedCopiedLines.getError());
    }

    return Result.success(createdCopy.getValue());
  }

  private isApprovedStatus(status: BudgetStatus): boolean {
    return [
      BudgetStatus.APROVADO_CONCORRENCIA,
      BudgetStatus.APROVADO_PRODUCAO,
    ].includes(status);
  }
}
