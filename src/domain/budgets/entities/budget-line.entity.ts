import { Result } from "@shared/result";
import { BillingType } from "@domain/budgets/enums/billing-type.enum";

export class BudgetLine {
  private constructor(
    public id: string,
    public budgetId: string,
    public categoryCode: string,
    public parentId: string | null,
    public order: number,
    public name: string,
    public description: string,
    public billingType: BillingType,
    public quantity: number,
    public dailyRates: number,
    public unitValue: number,
    public totalValue: number,
    public upfrontPayment: number,
    public installment30Days: number,
    public installment45Days: number,
    public installment60Days: number,
    public installment90Days: number,
    public installment120Days: number,
    public billingUnitValue: number,
    public billingTotalValue: number,
  ) {}

  static create(input: {
    budgetId: string;
    categoryCode: string;
    parentId?: string | null;
    order: number;
    name: string;
    description?: string;
    billingType?: BillingType;
    quantity?: number;
    dailyRates?: number;
    unitValue?: number;
    totalValue?: number;
    upfrontPayment?: number;
    installment30Days?: number;
    installment45Days?: number;
    installment60Days?: number;
    installment90Days?: number;
    installment120Days?: number;
    billingUnitValue?: number;
    billingTotalValue?: number;
  }): Result<BudgetLine> {
    const line = new BudgetLine(
      "",
      input.budgetId,
      input.categoryCode,
      input.parentId ?? null,
      input.order,
      input.name,
      input.description ?? "",
      input.billingType ?? BillingType.UNIT,
      input.quantity ?? 0,
      input.dailyRates ?? 0,
      input.unitValue ?? 0,
      input.totalValue ?? 0,
      input.upfrontPayment ?? 0,
      input.installment30Days ?? 0,
      input.installment45Days ?? 0,
      input.installment60Days ?? 0,
      input.installment90Days ?? 0,
      input.installment120Days ?? 0,
      input.billingUnitValue ?? 0,
      input.billingTotalValue ?? 0,
    );

    return line.validate();
  }

  static read(input: {
    id: string;
    budgetId: string;
    categoryCode: string;
    parentId: string | null;
    order: number;
    name: string;
    description: string;
    billingType: BillingType;
    quantity: number;
    dailyRates: number;
    unitValue: number;
    totalValue: number;
    upfrontPayment: number;
    installment30Days: number;
    installment45Days: number;
    installment60Days: number;
    installment90Days: number;
    installment120Days: number;
    billingUnitValue: number;
    billingTotalValue: number;
  }): BudgetLine {
    return new BudgetLine(
      input.id,
      input.budgetId,
      input.categoryCode,
      input.parentId,
      input.order,
      input.name,
      input.description,
      input.billingType,
      input.quantity,
      input.dailyRates,
      input.unitValue,
      input.totalValue,
      input.upfrontPayment,
      input.installment30Days,
      input.installment45Days,
      input.installment60Days,
      input.installment90Days,
      input.installment120Days,
      input.billingUnitValue,
      input.billingTotalValue,
    );
  }

  update(input: {
    categoryCode?: string;
    parentId?: string | null;
    order?: number;
    name?: string;
    description?: string;
    billingType?: BillingType;
    quantity?: number;
    dailyRates?: number;
    unitValue?: number;
    totalValue?: number;
    upfrontPayment?: number;
    installment30Days?: number;
    installment45Days?: number;
    installment60Days?: number;
    installment90Days?: number;
    installment120Days?: number;
    billingUnitValue?: number;
    billingTotalValue?: number;
  }): Result<BudgetLine> {
    if (input.categoryCode !== undefined) this.categoryCode = input.categoryCode;
    if (input.parentId !== undefined) this.parentId = input.parentId;
    if (input.order !== undefined) this.order = input.order;
    if (input.name !== undefined) this.name = input.name;
    if (input.description !== undefined) this.description = input.description;
    if (input.billingType !== undefined) this.billingType = input.billingType;
    if (input.quantity !== undefined) this.quantity = input.quantity;
    if (input.dailyRates !== undefined) this.dailyRates = input.dailyRates;
    if (input.unitValue !== undefined) this.unitValue = input.unitValue;
    if (input.totalValue !== undefined) this.totalValue = input.totalValue;
    if (input.upfrontPayment !== undefined)
      this.upfrontPayment = input.upfrontPayment;
    if (input.installment30Days !== undefined)
      this.installment30Days = input.installment30Days;
    if (input.installment45Days !== undefined)
      this.installment45Days = input.installment45Days;
    if (input.installment60Days !== undefined)
      this.installment60Days = input.installment60Days;
    if (input.installment90Days !== undefined)
      this.installment90Days = input.installment90Days;
    if (input.installment120Days !== undefined)
      this.installment120Days = input.installment120Days;
    if (input.billingUnitValue !== undefined)
      this.billingUnitValue = input.billingUnitValue;
    if (input.billingTotalValue !== undefined)
      this.billingTotalValue = input.billingTotalValue;

    return this.validate();
  }

  private validate(): Result<BudgetLine> {
    if (!this.budgetId?.trim())
      return Result.failure("Orçamento é obrigatório");
    if (!this.categoryCode?.trim())
      return Result.failure("Categoria da linha é obrigatória");
    if (!this.name?.trim())
      return Result.failure("Nome da linha é obrigatório");
    if (!Object.values(BillingType).includes(this.billingType)) {
      return Result.failure("Tipo de faturamento inválido");
    }

    if (this.order < 0) return Result.failure("Ordem da linha inválida");
    if (this.quantity < 0) return Result.failure("Quantidade inválida");
    if (this.dailyRates < 0) return Result.failure("Diárias inválidas");
    if (this.unitValue < 0) return Result.failure("Valor unitário inválido");
    if (this.totalValue < 0) return Result.failure("Valor total inválido");
    if (this.upfrontPayment < 0) return Result.failure("Antecipação inválida");
    if (this.installment30Days < 0)
      return Result.failure("Parcela de 30 dias inválida");
    if (this.installment45Days < 0)
      return Result.failure("Parcela de 45 dias inválida");
    if (this.installment60Days < 0)
      return Result.failure("Parcela de 60 dias inválida");
    if (this.installment90Days < 0)
      return Result.failure("Parcela de 90 dias inválida");
    if (this.installment120Days < 0)
      return Result.failure("Parcela de 120 dias inválida");
    if (this.billingUnitValue < 0)
      return Result.failure("Valor unitário de faturamento inválido");
    if (this.billingTotalValue < 0)
      return Result.failure("Valor total de faturamento inválido");

    this.budgetId = this.budgetId.trim();
    this.categoryCode = this.categoryCode.trim();
    this.name = this.name.trim();
    this.description = this.description?.trim() ?? "";

    return Result.success(this);
  }
}
