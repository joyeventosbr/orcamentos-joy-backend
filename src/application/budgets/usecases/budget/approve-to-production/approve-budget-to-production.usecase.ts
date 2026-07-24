import { Inject, Injectable } from "@nestjs/common";
import { Budget } from "@domain/budgets/entities/budget.entity";
import { BudgetLine } from "@domain/budgets/entities/budget-line.entity";
import { FolderBudget } from "@domain/budgets/entities/folder-budget.entity";
import { BudgetStatus } from "@domain/budgets/enums/budget-status.enum";
import type { IBudgetRepository } from "@domain/budgets/repositories/i-budget-repository";
import type { IBudgetLineRepository } from "@domain/budgets/repositories/i-budget-line-repository";
import type { IBudgetRelationRepository } from "@domain/budgets/repositories/i-budget-relation-repository";
import { Result } from "@shared/result";
import { ZError } from "@utils/index";
import { approveBudgetToProductionSchema } from "./approve-budget-to-production.dto";

@Injectable()
export class ApproveBudgetToProductionUseCase {
  constructor(
    @Inject("IBudgetRepository")
    private readonly budgetRepository: IBudgetRepository,
    @Inject("IBudgetLineRepository")
    private readonly budgetLineRepository: IBudgetLineRepository,
    @Inject("IBudgetRelationRepository")
    private readonly budgetRelationRepository: IBudgetRelationRepository,
  ) {}

  async execute(input: unknown): Promise<Result<Budget>> {
    const parsed = approveBudgetToProductionSchema.safeParse(input);

    if (!parsed.success) {
      const errors = ZError.create(parsed.error).errors;
      return Result.failure(errors[0] ?? "Dados inválidos");
    }

    const current = await this.budgetRepository.getById(parsed.data.id);
    if (current.isFailure()) return Result.failure(current.getError());

    const budget = current.getValue();
    if (!budget) return Result.failure("Orçamento não encontrado");

    if (
      budget.status !== BudgetStatus.CONCORRENCIA ||
      budget.version !== 0 ||
      budget.parentId
    ) {
      return Result.failure(
        "Aprovação direta para produção só pode ser feita no orçamento inicial em concorrência",
      );
    }

    const hasChildren = await this.budgetRepository.hasChildren(budget.id);
    if (hasChildren.isFailure()) return Result.failure(hasChildren.getError());

    if (hasChildren.getValue()) {
      return Result.failure(
        "Aprovação direta para produção só pode ser feita no orçamento inicial sem orçamentos vinculados",
      );
    }

    const maxVersion = await this.budgetRepository.getMaxVersionByRootId(
      budget.id,
    );
    if (maxVersion.isFailure()) {
      return Result.failure(maxVersion.getError());
    }

    const linesResult = await this.budgetLineRepository.getAllByBudgetId(
      budget.id,
    );
    if (linesResult.isFailure()) {
      return Result.failure(linesResult.getError());
    }

    const production = Budget.create({
      name: budget.name,
      customerId: budget.customerId,
      folderId: budget.folderId,
      taxNf: budget.taxNf,
      createdBy: parsed.data.updatedBy,
      version: 0,
      status: BudgetStatus.PRODUCAO,
      parentId: budget.id,
      jobDescription: budget.jobDescription,
      location: budget.location,
      eventDate: budget.eventDate,
      paymentTerm: budget.paymentTerm,
    });
    if (production.isFailure()) {
      return Result.failure(production.getError());
    }

    const createdProduction = await this.budgetRepository.create(
      production.getValue(),
    );
    if (createdProduction.isFailure()) {
      return Result.failure(createdProduction.getError());
    }

    const productionFolderBudget = FolderBudget.create({
      folderId: budget.folderId,
      budgetId: createdProduction.getValue().id,
    });
    if (productionFolderBudget.isFailure()) {
      return Result.failure(productionFolderBudget.getError());
    }

    const linkedProductionFolderBudget =
      await this.budgetRelationRepository.createFolderBudget(
        productionFolderBudget.getValue(),
      );
    if (linkedProductionFolderBudget.isFailure()) {
      return Result.failure(linkedProductionFolderBudget.getError());
    }

    const productionLines = linesResult.getValue().map((line) =>
      BudgetLine.create({
        budgetId: createdProduction.getValue().id,
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
    const invalidProductionLine = productionLines.find((line) =>
      line.isFailure(),
    );
    if (invalidProductionLine?.isFailure()) {
      return Result.failure(invalidProductionLine.getError());
    }

    const savedProductionLines = await this.budgetLineRepository.createMany(
      productionLines.map((line) => line.getValue()),
    );
    if (savedProductionLines.isFailure()) {
      return Result.failure(savedProductionLines.getError());
    }

    return Result.success(createdProduction.getValue());
  }

  private getBaseName(name: string): string {
    return name.replace(/\s+v\d+$/i, "").trim();
  }
}
