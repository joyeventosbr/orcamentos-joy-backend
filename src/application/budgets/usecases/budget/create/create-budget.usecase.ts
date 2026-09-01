import { Inject, Injectable } from "@nestjs/common";
import { Result } from "@shared/result";
import { Budget } from "@domain/budgets/entities/budget.entity";
import { FolderBudget } from "@domain/budgets/entities/folder-budget.entity";
import type { IBudgetRepository } from "@domain/budgets/repositories/i-budget-repository";
import type { IBudgetLineRepository } from "@domain/budgets/repositories/i-budget-line-repository";
import type { IBudgetRelationRepository } from "@domain/budgets/repositories/i-budget-relation-repository";
import type { IFolderRepository } from "@domain/folders/repositories/i-folder-repository";
import type { ISettingRepository } from "@domain/settings/repositories/i-setting-repository";
import { BudgetStatus } from "@domain/budgets/enums/budget-status.enum";
import { createBudgetSchema } from "./create-budget.dto";
import { ZError } from "@utils/index";
import { DefaultBudgetLinesFactory } from "@application/budgets/factories/default-budget-lines.factory";

@Injectable()
export class CreateBudgetUseCase {
  constructor(
    @Inject("IBudgetRepository")
    private readonly budgetRepository: IBudgetRepository,
    @Inject("IBudgetLineRepository")
    private readonly budgetLineRepository: IBudgetLineRepository,
    @Inject("IBudgetRelationRepository")
    private readonly budgetRelationRepository: IBudgetRelationRepository,
    @Inject("IFolderRepository")
    private readonly folderRepository: IFolderRepository,
    @Inject("ISettingRepository")
    private readonly settingRepository: ISettingRepository,
  ) {}

  async execute(input: unknown): Promise<Result<Budget>> {
    const parsed = createBudgetSchema.safeParse(input);

    if (!parsed.success) {
      const errors = ZError.create(parsed.error).errors;
      return Result.failure(errors[0] ?? "Dados inválidos");
    }

    const folderResult = await this.folderRepository.getById(
      parsed.data.folderId,
    );
    if (folderResult.isFailure()) {
      return Result.failure(folderResult.getError());
    }

    const folder = folderResult.getValue();
    if (!folder) {
      return Result.failure("Pasta não encontrada");
    }

    if (folder.customerId !== parsed.data.customerId) {
      return Result.failure("Pasta não pertence ao cliente informado");
    }

    const taxNfSetting = await this.settingRepository.getByKey("TAX_NF");
    if (taxNfSetting.isFailure()) {
      return Result.failure(taxNfSetting.getError());
    }

    const taxNf = Number(taxNfSetting.getValue()?.value);
    if (!Number.isFinite(taxNf) || taxNf <= 0) {
      return Result.failure("Configuração TAX_NF inválida ou não encontrada");
    }

    const budgetResult = Budget.create({
      name: parsed.data.name,
      customerId: parsed.data.customerId,
      folderId: parsed.data.folderId,
      taxNf,
      createdBy: parsed.data.createdBy,
      status: BudgetStatus.CONCORRENCIA,
    });
    if (budgetResult.isFailure()) {
      return Result.failure(budgetResult.getError());
    }

    const createdBudget = await this.budgetRepository.create(
      budgetResult.getValue(),
    );
    if (createdBudget.isFailure()) {
      return Result.failure(createdBudget.getError());
    }

    const budget = createdBudget.getValue();
    const folderBudget = FolderBudget.create({
      folderId: parsed.data.folderId,
      budgetId: budget.id,
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

    const linesResult = DefaultBudgetLinesFactory.create(budget.id);
    if (linesResult.isFailure()) {
      return Result.failure(linesResult.getError());
    }

    const createdLines = await this.budgetLineRepository.createMany(
      linesResult.getValue(),
    );
    if (createdLines.isFailure()) {
      return Result.failure(createdLines.getError());
    }

    return Result.success(budget);
  }
}
