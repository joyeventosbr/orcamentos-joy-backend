import { Inject, Injectable } from "@nestjs/common";
import { Result } from "@shared/result";
import type { IBudgetRepository } from "@domain/budgets/repositories/budget/i-budget-repository";
import { exportBudgetSchema } from "./export-budget.dto";
import { ZError } from "@utils/index";

@Injectable()
export class ExportBudgetUseCase {
  constructor(
    @Inject("IBudgetRepository")
    private readonly budgetRepository: IBudgetRepository,
  ) {}

  async execute(input: unknown): Promise<
    Result<{ fileName: string; mimeType: string; content: string }>
  > {
    const parsed = exportBudgetSchema.safeParse(input);

    if (!parsed.success) {
      const errors = ZError.create(parsed.error).errors;
      return Result.failure(errors[0] ?? "Dados inválidos");
    }

    const budgetResult = await this.budgetRepository.getById(parsed.data.id);

    if (budgetResult.isFailure()) return Result.failure(budgetResult.getError());

    const budget = budgetResult.getValue();
    if (!budget) return Result.failure("Orçamento não encontrado");

    const header = [
      "id",
      "parentId",
      "categoriaId",
      "orcamentoId",
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
    ].join(",");

    const lines = budget.items.map((item) =>
      [
        item.id,
        item.parentId ?? "",
        item.categoryId,
        budget.id,
        item.order,
        item.name,
        item.description,
        item.billingType,
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
