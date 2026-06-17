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
import { approveBudgetSchema } from "./approve-budget.dto";

@Injectable()
export class ApproveBudgetUseCase {
  constructor(
    @Inject("IBudgetRepository")
    private readonly budgetRepository: IBudgetRepository,
    @Inject("IBudgetLineRepository")
    private readonly budgetLineRepository: IBudgetLineRepository,
    @Inject("IBudgetRelationRepository")
    private readonly budgetRelationRepository: IBudgetRelationRepository,
  ) {}

  async execute(input: unknown): Promise<Result<Budget[]>> {
    const parsed = approveBudgetSchema.safeParse(input);

    if (!parsed.success) {
      const errors = ZError.create(parsed.error).errors;
      return Result.failure(errors[0] ?? "Dados inválidos");
    }

    const current = await this.budgetRepository.getById(parsed.data.id);
    if (current.isFailure()) return Result.failure(current.getError());

    const budget = current.getValue();
    if (!budget) return Result.failure("Orçamento não encontrado");

    const rootBudgetId = budget.parentId ?? budget.id;
    const maxVersion =
      await this.budgetRepository.getMaxVersionByRootId(rootBudgetId);
    if (maxVersion.isFailure()) {
      return Result.failure(maxVersion.getError());
    }

    const linesResult = await this.budgetLineRepository.getAllByBudgetId(
      budget.id,
    );
    if (linesResult.isFailure()) {
      return Result.failure(linesResult.getError());
    }

    const createdBudgets: Budget[] = [];

    if (budget.status === BudgetStatus.CONCORRENCIA) {
      const approvedCompetition = Budget.create({
        name: budget.name,
        customerId: budget.customerId,
        folderId: budget.folderId,
        taxNf: budget.taxNf,
        createdBy: parsed.data.updatedBy,
        version: 0,
        status: BudgetStatus.APROVADO_CONCORRENCIA,
        parentId: rootBudgetId,
        jobDescription: budget.jobDescription,
        location: budget.location,
        eventDate: budget.eventDate,
        paymentTerm: budget.paymentTerm,
      });
      if (approvedCompetition.isFailure()) {
        return Result.failure(approvedCompetition.getError());
      }

      const createdApprovedCompetition = await this.budgetRepository.create(
        approvedCompetition.getValue(),
      );
      if (createdApprovedCompetition.isFailure()) {
        return Result.failure(createdApprovedCompetition.getError());
      }

      const approvedCompetitionFolderBudget = FolderBudget.create({
        folderId: budget.folderId,
        budgetId: createdApprovedCompetition.getValue().id,
      });
      if (approvedCompetitionFolderBudget.isFailure()) {
        return Result.failure(approvedCompetitionFolderBudget.getError());
      }

      const linkedApprovedCompetitionFolderBudget =
        await this.budgetRelationRepository.createFolderBudget(
          approvedCompetitionFolderBudget.getValue(),
        );
      if (linkedApprovedCompetitionFolderBudget.isFailure()) {
        return Result.failure(linkedApprovedCompetitionFolderBudget.getError());
      }

      const approvedCompetitionLines = linesResult.getValue().map((line) =>
        BudgetLine.create({
          budgetId: createdApprovedCompetition.getValue().id,
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
          percentNfOver: line.percentNfOver ?? undefined,
        }),
      );
      const invalidApprovedCompetitionLine = approvedCompetitionLines.find(
        (line) => line.isFailure(),
      );
      if (invalidApprovedCompetitionLine?.isFailure()) {
        return Result.failure(invalidApprovedCompetitionLine.getError());
      }

      const savedApprovedCompetitionLines =
        await this.budgetLineRepository.createMany(
          approvedCompetitionLines.map((line) => line.getValue()),
        );
      if (savedApprovedCompetitionLines.isFailure()) {
        return Result.failure(savedApprovedCompetitionLines.getError());
      }

      createdBudgets.push(createdApprovedCompetition.getValue());

      const production = Budget.create({
        name: budget.name,
        customerId: budget.customerId,
        folderId: budget.folderId,
        taxNf: budget.taxNf,
        createdBy: parsed.data.updatedBy,
        version: 0,
        status: BudgetStatus.PRODUCAO,
        parentId: rootBudgetId,
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
          percentNfOver: line.percentNfOver ?? undefined,
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

      createdBudgets.push(createdProduction.getValue());

      return Result.success(createdBudgets);
    }

    if (budget.status === BudgetStatus.PRODUCAO) {
      const approvedProduction = Budget.create({
        name: budget.name,
        customerId: budget.customerId,
        folderId: budget.folderId,
        taxNf: budget.taxNf,
        createdBy: parsed.data.updatedBy,
        version: budget.version,
        status: BudgetStatus.APROVADO_PRODUCAO,
        parentId: rootBudgetId,
        jobDescription: budget.jobDescription,
        location: budget.location,
        eventDate: budget.eventDate,
        paymentTerm: budget.paymentTerm,
      });
      if (approvedProduction.isFailure()) {
        return Result.failure(approvedProduction.getError());
      }

      const createdApprovedProduction = await this.budgetRepository.create(
        approvedProduction.getValue(),
      );
      if (createdApprovedProduction.isFailure()) {
        return Result.failure(createdApprovedProduction.getError());
      }

      const approvedProductionFolderBudget = FolderBudget.create({
        folderId: budget.folderId,
        budgetId: createdApprovedProduction.getValue().id,
      });
      if (approvedProductionFolderBudget.isFailure()) {
        return Result.failure(approvedProductionFolderBudget.getError());
      }

      const linkedApprovedProductionFolderBudget =
        await this.budgetRelationRepository.createFolderBudget(
          approvedProductionFolderBudget.getValue(),
        );
      if (linkedApprovedProductionFolderBudget.isFailure()) {
        return Result.failure(linkedApprovedProductionFolderBudget.getError());
      }

      const approvedProductionLines = linesResult.getValue().map((line) =>
        BudgetLine.create({
          budgetId: createdApprovedProduction.getValue().id,
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
          percentNfOver: line.percentNfOver ?? undefined,
        }),
      );
      const invalidApprovedProductionLine = approvedProductionLines.find(
        (line) => line.isFailure(),
      );
      if (invalidApprovedProductionLine?.isFailure()) {
        return Result.failure(invalidApprovedProductionLine.getError());
      }

      const savedApprovedProductionLines =
        await this.budgetLineRepository.createMany(
          approvedProductionLines.map((line) => line.getValue()),
        );
      if (savedApprovedProductionLines.isFailure()) {
        return Result.failure(savedApprovedProductionLines.getError());
      }

      return Result.success([createdApprovedProduction.getValue()]);
    }

    return Result.failure("Status do orçamento não permite aprovação");
  }
}
