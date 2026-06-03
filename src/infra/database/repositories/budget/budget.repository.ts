import { Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Budget } from "@domain/budgets/entities/budget.entity";
import { FolderBudget } from "@domain/budgets/entities/folder-budget.entity";
import type { IBudgetRepository } from "@domain/budgets/repositories/i-budget-repository";
import type { IBudgetRelationRepository } from "@domain/budgets/repositories/i-budget-relation-repository";
import { Result } from "@shared/result";
import { Repository } from "typeorm";
import { BudgetSchema } from "@infra/database/typeorm/schemas/budget.schema";
import { BudgetMapper } from "@infra/database/mappers/budget.mapper";
import { BudgetDetailResponseDto } from "@domain/budgets/dtos/budget-detail/budget-detail-response.dto";
import { BudgetLineDetailResponseDto } from "@domain/budgets/dtos/budget-detail/budget-line-detail-response.dto";
import { BillingType } from "@domain/budgets/enums/billing-type.enum";
import { PaymentTerm } from "@domain/budgets/enums/payment-term.enum";
import { BudgetStatus } from "@domain/budgets/enums/budget-status.enum";
import { BudgetDetailRawQueryDto } from "./dtos/budget-detail-raw-query.dto";

@Injectable()
export class BudgetRepository implements IBudgetRepository {
  constructor(
    @InjectRepository(BudgetSchema)
    private readonly budgetSchemaRepository: Repository<BudgetSchema>,
    @Inject("IBudgetRelationRepository")
    private readonly budgetRelationRepository: IBudgetRelationRepository,
  ) {}

  async create(data: Budget): Promise<Result<Budget>> {
    try {
      const saved = await this.budgetSchemaRepository.save({
        ...BudgetMapper.toSchema(data),
        createdAt: data.createdAt,
      });

      return Result.success(BudgetMapper.toEntity(saved, data.folderId));
    } catch (error) {
      return Result.failure("Falha ao criar orçamento, erro: " + error);
    }
  }

  async update(data: Budget): Promise<Result<Budget>> {
    try {
      await this.budgetSchemaRepository.save({
        ...BudgetMapper.toSchema(data),
        id: data.id,
        updatedAt: new Date(),
      });

      const folderBudgetResult = await this.saveFolderBudget(
        data.folderId,
        data.id,
        true,
      );
      if (folderBudgetResult.isFailure()) {
        return Result.failure(folderBudgetResult.getError());
      }

      const updated = await this.getBudget(data.id);
      if (!updated) return Result.failure("Orçamento não encontrado");

      return Result.success(updated);
    } catch (error) {
      return Result.failure("Falha ao atualizar orçamento, erro: " + error);
    }
  }

  async updateAudit(data: Budget): Promise<Result<Budget>> {
    try {
      await this.budgetSchemaRepository.update(
        { id: data.id },
        {
          updatedBy: data.updatedBy,
          updatedAt: data.updatedAt ?? new Date(),
        },
      );

      const updated = await this.getBudget(data.id);
      if (!updated) return Result.failure("Orçamento não encontrado");

      return Result.success(updated);
    } catch (error) {
      return Result.failure(
        "Falha ao atualizar auditoria do orçamento, erro: " + error,
      );
    }
  }

  async delete(id: string): Promise<Result<void>> {
    try {
      await this.budgetSchemaRepository.delete({ id });
      return Result.success();
    } catch (error) {
      return Result.failure("Falha ao remover orçamento, erro: " + error);
    }
  }

  async getById(id: string): Promise<Result<Budget | null>> {
    try {
      return Result.success(await this.getBudget(id));
    } catch (error) {
      return Result.failure("Falha ao buscar orçamento, erro: " + error);
    }
  }

  async getMaxVersionByRootId(rootId: string): Promise<Result<number>> {
    try {
      const result = await this.budgetSchemaRepository
        .createQueryBuilder("budget")
        .select("MAX(budget.version)", "maxVersion")
        .where("budget.id = :rootId", { rootId })
        .orWhere("budget.parent_id = :rootId", { rootId })
        .getRawOne<{ maxVersion: number | string | null }>();

      return Result.success(Number(result?.maxVersion ?? 0));
    } catch (error) {
      return Result.failure(
        "Falha ao buscar versão do orçamento, erro: " + error,
      );
    }
  }

  async hasChildren(id: string): Promise<Result<boolean>> {
    try {
      const count = await this.budgetSchemaRepository.count({
        where: { parentId: id },
      });

      return Result.success(count > 0);
    } catch (error) {
      return Result.failure(
        "Falha ao buscar vínculos do orçamento, erro: " + error,
      );
    }
  }

  async getByIdWithLines(
    id: string,
  ): Promise<Result<BudgetDetailResponseDto | null>> {
    try {
      const rows = await this.budgetSchemaRepository
        .createQueryBuilder("budget")
        .innerJoin(
          "tb_folders_budgets",
          "folderBudget",
          "folderBudget.budget_id = budget.id",
        )
        .innerJoin(
          "tb_customers",
          "customer",
          "customer.id = budget.customer_id",
        )
        .innerJoin("tb_folders", "folder", "folder.id = folderBudget.folder_id")
        .leftJoin("tb_budget_lines", "line", "line.budget_id = budget.id")
        .select([
          'budget.id AS "budget_id"',
          'budget.name AS "budget_name"',
          'budget.customer_id AS "budget_customer_id"',
          'customer.name AS "budget_customer_name"',
          'folderBudget.folder_id AS "budget_folder_id"',
          'folder.name AS "budget_folder_name"',
          'budget.tax_nf AS "budget_tax_nf"',
          'budget.status AS "budget_status"',
          'budget.is_editable AS "budget_is_editable"',
          'budget.parent_id AS "budget_parent_id"',
          'budget.version AS "budget_version"',
          'budget.created_by AS "budget_created_by"',
          'budget.updated_by AS "budget_updated_by"',
          'budget.job_description AS "budget_job_description"',
          'budget.location AS "budget_location"',
          'budget.event_date AS "budget_event_date"',
          'budget.payment_term AS "budget_payment_term"',
          'budget.created_at AS "budget_created_at"',
          'budget.updated_at AS "budget_updated_at"',
          'line.id AS "line_id"',
          'line.budget_id AS "line_budget_id"',
          'line.category_code AS "line_category_code"',
          'line.parent_id AS "line_parent_id"',
          'line.order AS "line_order"',
          'line.name AS "line_name"',
          'line.description AS "line_description"',
          'line.billing_type AS "line_billing_type"',
          'line.quantity AS "line_quantity"',
          'line.daily_rates AS "line_daily_rates"',
          'line.unit_value AS "line_unit_value"',
          'line.total_value AS "line_total_value"',
          'line.upfront_payment AS "line_upfront_payment"',
          'line.installment_30_days AS "line_installment_30_days"',
          'line.installment_45_days AS "line_installment_45_days"',
          'line.installment_60_days AS "line_installment_60_days"',
          'line.installment_90_days AS "line_installment_90_days"',
          'line.installment_120_days AS "line_installment_120_days"',
          'line.billing_unit_value AS "line_billing_unit_value"',
          'line.billing_total_value AS "line_billing_total_value"',
          'line.supplier AS "line_supplier"',
          'line.supplier_value AS "line_supplier_value"',
          'line.percent_bv AS "line_percent_bv"',
          'line.percent_nf_bv AS "line_percent_nf_bv"',
          'line.bv_value AS "line_bv_value"',
          'line.percent_nf_over AS "line_percent_nf_over"',
          'line.over_value AS "line_over_value"',
          'line.real_value AS "line_real_value"',
        ])
        .where("budget.id = :id", { id })
        .orderBy("line.category_code", "ASC")
        .addOrderBy("line.parent_id", "ASC", "NULLS FIRST")
        .addOrderBy("line.order", "ASC")
        .getRawMany<BudgetDetailRawQueryDto>();

      if (rows.length === 0) return Result.success(null);

      const first = rows[0];
      const response: BudgetDetailResponseDto = {
        id: first.budget_id,
        name: first.budget_name,
        customerId: first.budget_customer_id,
        customerName: first.budget_customer_name,
        folderId: first.budget_folder_id,
        folderName: first.budget_folder_name,
        taxNf: first.budget_tax_nf,
        status: this.toBudgetStatus(first.budget_status),
        isEditable: first.budget_is_editable,
        parentId: first.budget_parent_id,
        version: first.budget_version,
        createdBy: first.budget_created_by,
        updatedBy: first.budget_updated_by,
        jobDescription: first.budget_job_description ?? undefined,
        location: first.budget_location ?? undefined,
        eventDate: first.budget_event_date ?? undefined,
        paymentTerm: this.toPaymentTerm(first.budget_payment_term),
        createdAt: first.budget_created_at,
        updatedAt: first.budget_updated_at ?? undefined,
        lines: rows
          .filter((row) => row.line_id)
          .map((row) => this.toBudgetLineDetailResponse(row)),
      };

      return Result.success(response);
    } catch (error) {
      return Result.failure(
        "Falha ao buscar detalhes do orçamento, erro: " + error,
      );
    }
  }

  private toPaymentTerm(value: PaymentTerm | null): PaymentTerm | undefined {
    if (value === null) return undefined;
    if (!Object.values(PaymentTerm).includes(value)) {
      throw new Error("Prazo de pagamento inválido retornado pelo banco");
    }

    return value;
  }

  private toBudgetStatus(value: BudgetStatus): BudgetStatus {
    if (!Object.values(BudgetStatus).includes(value)) {
      throw new Error("Status do orçamento inválido retornado pelo banco");
    }

    return value;
  }

  private toBillingType(value: BillingType | null): BillingType | null {
    if (value === null) return null;

    if (!Object.values(BillingType).includes(value)) {
      throw new Error("Tipo de faturamento inválido retornado pelo banco");
    }

    return value;
  }

  private requiredString(value: string | null, field: string): string {
    if (value === null) {
      throw new Error(
        `Campo obrigatório ausente na linha do orçamento: ${field}`,
      );
    }

    return value;
  }

  private requiredNumber(value: number | null, field: string): number {
    if (value === null) {
      throw new Error(
        `Campo obrigatório ausente na linha do orçamento: ${field}`,
      );
    }

    return Number(value);
  }

  private toBudgetLineDetailResponse(
    row: BudgetDetailRawQueryDto,
  ): BudgetLineDetailResponseDto {
    return {
      id: this.requiredString(row.line_id, "id"),
      budgetId: this.requiredString(row.line_budget_id, "budgetId"),
      categoryCode: this.requiredString(row.line_category_code, "categoryCode"),
      parentId: row.line_parent_id,
      order: this.requiredNumber(row.line_order, "order"),
      name: this.requiredString(row.line_name, "name"),
      description: this.requiredString(row.line_description, "description"),
      billingType: this.toBillingType(row.line_billing_type),
      quantity: this.requiredNumber(row.line_quantity, "quantity"),
      dailyRates: this.requiredNumber(row.line_daily_rates, "dailyRates"),
      unitValue: this.requiredNumber(row.line_unit_value, "unitValue"),
      totalValue: this.requiredNumber(row.line_total_value, "totalValue"),
      upfrontPayment: this.requiredNumber(
        row.line_upfront_payment,
        "upfrontPayment",
      ),
      installment30Days: this.requiredNumber(
        row.line_installment_30_days,
        "installment30Days",
      ),
      installment45Days: this.requiredNumber(
        row.line_installment_45_days,
        "installment45Days",
      ),
      installment60Days: this.requiredNumber(
        row.line_installment_60_days,
        "installment60Days",
      ),
      installment90Days: this.requiredNumber(
        row.line_installment_90_days,
        "installment90Days",
      ),
      installment120Days: this.requiredNumber(
        row.line_installment_120_days,
        "installment120Days",
      ),
      billingUnitValue: this.requiredNumber(
        row.line_billing_unit_value,
        "billingUnitValue",
      ),
      billingTotalValue: this.requiredNumber(
        row.line_billing_total_value,
        "billingTotalValue",
      ),
      supplier: row.line_supplier,
      supplierValue: row.line_supplier_value,
      percentBv: row.line_percent_bv,
      percentNfBv: row.line_percent_nf_bv,
      bvValue: row.line_bv_value,
      percentNfOver: row.line_percent_nf_over,
      overValue: row.line_over_value,
      realValue: row.line_real_value,
    };
  }

  async getAll(): Promise<Result<Budget[]>> {
    try {
      const budgets = await this.budgetSchemaRepository.find({
        order: { createdAt: "DESC" },
      });
      const result: Budget[] = [];

      for (const budget of budgets) {
        const folderIdResult =
          await this.budgetRelationRepository.getFolderIdByBudgetId(budget.id);
        if (folderIdResult.isFailure()) {
          return Result.failure(folderIdResult.getError());
        }

        result.push(
          BudgetMapper.toEntity(budget, folderIdResult.getValue() ?? ""),
        );
      }

      return Result.success(result);
    } catch (error) {
      return Result.failure("Falha ao listar orçamentos, erro: " + error);
    }
  }

  private async getBudget(id: string): Promise<Budget | null> {
    const budget = await this.budgetSchemaRepository.findOne({ where: { id } });
    if (!budget) return null;

    const folderIdResult =
      await this.budgetRelationRepository.getFolderIdByBudgetId(id);
    if (folderIdResult.isFailure()) {
      throw new Error(folderIdResult.getError());
    }

    return BudgetMapper.toEntity(budget, folderIdResult.getValue() ?? "");
  }

  private async saveFolderBudget(
    folderId: string,
    budgetId: string,
    replace = false,
  ): Promise<Result<FolderBudget>> {
    const folderBudget = FolderBudget.create({ folderId, budgetId });
    if (folderBudget.isFailure()) {
      return Result.failure(folderBudget.getError());
    }

    return replace
      ? this.budgetRelationRepository.replaceFolderBudget(
          folderBudget.getValue(),
        )
      : this.budgetRelationRepository.createFolderBudget(
          folderBudget.getValue(),
        );
  }
}
