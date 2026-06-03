import { Inject, Injectable } from "@nestjs/common";
import { Result } from "@shared/result";
import type { IBudgetRepository } from "@domain/budgets/repositories/i-budget-repository";
import type { IBudgetLineRepository } from "@domain/budgets/repositories/i-budget-line-repository";
import { exportBudgetSchema } from "./export-budget.dto";
import { ZError } from "@utils/index";

@Injectable()
export class ExportBudgetUseCase {
  constructor(
    @Inject("IBudgetRepository")
    private readonly budgetRepository: IBudgetRepository,
    @Inject("IBudgetLineRepository")
    private readonly budgetLineRepository: IBudgetLineRepository,
  ) {}

  async execute(
    input: unknown,
  ): Promise<Result<{ fileName: string; mimeType: string; content: string }>> {
    const parsed = exportBudgetSchema.safeParse(input);

    if (!parsed.success) {
      const errors = ZError.create(parsed.error).errors;
      return Result.failure(errors[0] ?? "Dados inválidos");
    }

    const budgetResult = await this.budgetRepository.getById(parsed.data.id);
    if (budgetResult.isFailure())
      return Result.failure(budgetResult.getError());

    const budget = budgetResult.getValue();
    if (!budget) return Result.failure("Orçamento não encontrado");

    const linesResult = await this.budgetLineRepository.getAllByBudgetId(
      budget.id,
    );
    if (linesResult.isFailure()) return Result.failure(linesResult.getError());

    const header = [
      "id",
      "parentId",
      "categoriaCodigo",
      "orcamentoId",
      "taxaNf",
      "ordem",
      "nome",
      "descricao",
      "tipoFaturamento",
      "quantidade",
      "diarias",
      "valorUnitario",
      "valorTotal",
      "antecipacao",
      "parcela30",
      "parcela45",
      "parcela60",
      "parcela90",
      "parcela120",
      "faturamentoValorUnitario",
      "faturamentoValorTotal",
      "fornecedor",
      "valorFornecedor",
      "percentualBv",
      "percentualNfBv",
      "valorBv",
      "percentualNfOver",
      "valorOver",
      "valorReal",
    ].join(",");

    const lines = linesResult
      .getValue()
      .map((line) =>
        [
          line.id,
          line.parentId ?? "",
          line.categoryCode,
          budget.id,
          budget.taxNf,
          line.order,
          line.name,
          line.description,
          line.billingType,
          line.quantity,
          line.dailyRates,
          line.unitValue,
          line.totalValue,
          line.upfrontPayment,
          line.installment30Days,
          line.installment45Days,
          line.installment60Days,
          line.installment90Days,
          line.installment120Days,
          line.billingUnitValue,
          line.billingTotalValue,
          line.supplier ?? "",
          line.supplierValue ?? "",
          line.percentBv ?? "",
          line.percentNfBv ?? "",
          line.bvValue ?? "",
          line.percentNfOver ?? "",
          line.overValue ?? "",
          line.realValue ?? "",
        ]
          .map((value) => `"${String(value).replaceAll('"', '""')}"`)
          .join(","),
      );

    return Result.success({
      fileName: `orcamento-${budget.id}.csv`,
      mimeType: "text/csv; charset=utf-8",
      content: [header, ...lines].join("\n"),
    });
  }
}
