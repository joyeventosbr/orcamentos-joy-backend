import { BudgetLine } from "@domain/budgets/entities/budget-line.entity";
import { BillingType } from "@domain/budgets/enums/billing-type.enum";
import { Result } from "@shared/result";

export class DefaultBudgetLinesFactory {
  static create(budgetId: string): Result<BudgetLine[]> {
    const linesInput = [
      {
        categoryCode: "1.1",
        order: 1,
        name: "Locação de sala principal",
        description:
          "Sala plenária para evento corporativo com montagem em auditório.",
        billingType: BillingType.DAILY,
        quantity: 1,
        dailyRates: 2,
        unitValue: 4500,
        totalValue: 9000,
        upfrontPayment: 2700,
        installment30Days: 6300,
        billingUnitValue: 4500,
        billingTotalValue: 9000,
      },
      {
        categoryCode: "1.2",
        order: 2,
        name: "Coffee break manhã",
        description:
          "Serviço de A&B para 80 participantes com bebidas quentes, sucos e itens salgados.",
        billingType: BillingType.UNIT,
        quantity: 80,
        unitValue: 48,
        totalValue: 3840,
        upfrontPayment: 1152,
        installment30Days: 2688,
        billingUnitValue: 48,
        billingTotalValue: 3840,
      },
      {
        categoryCode: "1.3",
        order: 3,
        name: "Técnica de áudio e projeção",
        description:
          "Kit técnico com operador, caixas, microfones sem fio e projetor de alta luminosidade.",
        billingType: BillingType.FIXED,
        quantity: 1,
        unitValue: 7200,
        totalValue: 7200,
        upfrontPayment: 2160,
        installment45Days: 5040,
        billingUnitValue: 7200,
        billingTotalValue: 7200,
      },
      {
        categoryCode: "1.4",
        order: 4,
        name: "Cenografia de palco",
        description:
          "Painel modular, testeira personalizada e acabamento visual para fotos oficiais.",
        billingType: BillingType.FIXED,
        quantity: 1,
        unitValue: 12500,
        totalValue: 12500,
        upfrontPayment: 3750,
        installment60Days: 8750,
        billingUnitValue: 12500,
        billingTotalValue: 12500,
      },
      {
        categoryCode: "1.5",
        order: 5,
        name: "Credenciais e sinalização",
        description:
          "Crachás, cordões, placas direcionais e sinalização de acesso aos ambientes.",
        billingType: BillingType.UNIT,
        quantity: 120,
        unitValue: 22,
        totalValue: 2640,
        upfrontPayment: 792,
        installment30Days: 1848,
        billingUnitValue: 22,
        billingTotalValue: 2640,
      },
      {
        categoryCode: "1.8",
        order: 6,
        name: "Equipe de recepção",
        description:
          "Recepcionistas para check-in, orientação de fluxo e suporte aos convidados.",
        billingType: BillingType.DAILY,
        quantity: 4,
        dailyRates: 2,
        unitValue: 520,
        totalValue: 4160,
        upfrontPayment: 1248,
        installment45Days: 2912,
        billingUnitValue: 520,
        billingTotalValue: 4160,
      },
      {
        categoryCode: "1.9",
        order: 7,
        name: "Transporte de materiais",
        description:
          "Retirada, entrega e retorno de materiais técnicos e promocionais.",
        billingType: BillingType.FIXED,
        quantity: 1,
        unitValue: 1850,
        totalValue: 1850,
        upfrontPayment: 555,
        installment30Days: 1295,
        billingUnitValue: 1850,
        billingTotalValue: 1850,
      },
      {
        categoryCode: "2.1",
        order: 8,
        name: "Coordenação Joy Eventos",
        description:
          "Gestão operacional, alinhamentos com fornecedores e acompanhamento no dia do evento.",
        billingType: BillingType.FIXED,
        quantity: 1,
        unitValue: 9800,
        totalValue: 9800,
        upfrontPayment: 2940,
        installment90Days: 6860,
        billingUnitValue: 9800,
        billingTotalValue: 9800,
      },
    ];

    const lines: BudgetLine[] = [];

    for (const lineInput of linesInput) {
      const lineResult = BudgetLine.create({
        budgetId,
        dailyRates: 0,
        installment30Days: 0,
        installment45Days: 0,
        installment60Days: 0,
        installment90Days: 0,
        installment120Days: 0,
        ...lineInput,
      });

      if (lineResult.isFailure()) {
        return Result.failure(lineResult.getError());
      }

      lines.push(lineResult.getValue());
    }

    return Result.success(lines);
  }
}
