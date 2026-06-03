import { BillingType } from "@domain/budgets/enums/billing-type.enum";
import { Result } from "@shared/result";

export class BudgetLine {
  private constructor(
    public id: string,
    public budgetId: string,
    public categoryCode: string,
    public parentId: string | null,
    public order: number,
    public name: string,
    public description: string,
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
    public billingType: BillingType | null,
    public supplier: string | null,
    public supplierValue: number | null,
    public percentBv: number | null,
    public percentNfBv: number | null,
    public bvValue: number | null,
    public percentNfOver: number | null,
    public overValue: number | null,
    public realValue: number | null,
  ) {}

  static create(input: {
    budgetId: string;
    categoryCode: string;
    parentId?: string | null;
    order: number;
    name: string;
    description?: string;
    billingType?: BillingType | null;
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
    supplier?: string | null;
    supplierValue?: number;
    percentBv?: number;
    percentNfBv?: number;
    bvValue?: number;
    percentNfOver?: number;
    overValue?: number;
    realValue?: number;
  }): Result<BudgetLine> {
    if (!input.budgetId?.trim())
      return Result.failure("Orçamento é obrigatório");
    if (!input.categoryCode?.trim())
      return Result.failure("Categoria da linha é obrigatória");
    if (!input.name?.trim())
      return Result.failure("Nome da linha é obrigatório");

    if (input.order < 0) return Result.failure("Ordem da linha inválida");
    if (input.quantity && input.quantity < 0)
      return Result.failure("Quantidade inválida");
    if (input.dailyRates && input.dailyRates < 0)
      return Result.failure("Diárias inválidas");
    if (input.unitValue && input.unitValue < 0)
      return Result.failure("Valor unitário inválido");
    if (input.totalValue && input.totalValue < 0)
      return Result.failure("Valor total inválido");
    if (input.upfrontPayment && input.upfrontPayment < 0)
      return Result.failure("Antecipação inválida");
    if (input.installment30Days && input.installment30Days < 0)
      return Result.failure("Parcela de 30 dias inválida");
    if (input.installment45Days && input.installment45Days < 0)
      return Result.failure("Parcela de 45 dias inválida");
    if (input.installment60Days && input.installment60Days < 0)
      return Result.failure("Parcela de 60 dias inválida");
    if (input.installment90Days && input.installment90Days < 0)
      return Result.failure("Parcela de 90 dias inválida");
    if (input.installment120Days && input.installment120Days < 0)
      return Result.failure("Parcela de 120 dias inválida");
    if (input.billingUnitValue && input.billingUnitValue < 0)
      return Result.failure("Valor unitário de faturamento inválido");
    if (input.billingTotalValue && input.billingTotalValue < 0)
      return Result.failure("Valor total de faturamento inválido");
    if (input.supplierValue && input.supplierValue < 0)
      return Result.failure("Valor do fornecedor inválido");
    if (input.percentBv && input.percentBv < 0)
      return Result.failure("Percentual de BV inválido");
    if (input.percentNfBv && input.percentNfBv < 0)
      return Result.failure("Percentual de NF BV inválido");
    if (input.bvValue && input.bvValue < 0)
      return Result.failure("Valor de BV inválido");
    if (input.percentNfOver && input.percentNfOver < 0)
      return Result.failure("Percentual de NF over inválido");
    if (input.overValue && input.overValue < 0)
      return Result.failure("Valor de over inválido");
    if (input.realValue && input.realValue < 0)
      return Result.failure("Valor real inválido");

    const line = new BudgetLine(
      "",
      input.budgetId,
      input.categoryCode,
      input.parentId ?? null,
      input.order,
      input.name,
      input.description ?? "",
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
      input.billingType ?? null,
      input.supplier?.trim() ?? null,
      input.supplierValue ?? null,
      input.percentBv ?? null,
      input.percentNfBv ?? null,
      input.bvValue ?? null,
      input.percentNfOver ?? null,
      input.overValue ?? null,
      input.realValue ?? null,
    );

    return line.computeDerivedValues();
  }

  static read(input: {
    id: string;
    budgetId: string;
    categoryCode: string;
    parentId: string | null;
    order: number;
    name: string;
    description: string;
    billingType: BillingType | null;
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
    supplier: string | null;
    supplierValue: number | null;
    percentBv: number | null;
    percentNfBv: number | null;
    bvValue: number | null;
    percentNfOver: number | null;
    overValue: number | null;
    realValue: number | null;
  }): BudgetLine {
    return new BudgetLine(
      input.id,
      input.budgetId,
      input.categoryCode,
      input.parentId,
      input.order,
      input.name,
      input.description,
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
      input.billingType,
      input.supplier,
      input.supplierValue,
      input.percentBv,
      input.percentNfBv,
      input.bvValue,
      input.percentNfOver,
      input.overValue,
      input.realValue,
    );
  }

  update(input: {
    categoryCode?: string;
    parentId?: string | null;
    order?: number;
    name?: string;
    description?: string;
    billingType?: BillingType | null;
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
    supplier?: string | null;
    supplierValue?: number;
    percentBv?: number;
    percentNfBv?: number;
    bvValue?: number;
    percentNfOver?: number;
    overValue?: number;
    realValue?: number;
  }): Result<BudgetLine> {
    if (input.categoryCode !== undefined)
      this.categoryCode = input.categoryCode;
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
    if (input.supplier !== undefined)
      this.supplier = input.supplier?.trim() ?? null;
    if (input.supplierValue !== undefined)
      this.supplierValue = input.supplierValue;
    if (input.percentBv !== undefined) this.percentBv = input.percentBv;
    if (input.percentNfBv !== undefined) this.percentNfBv = input.percentNfBv;
    if (input.bvValue !== undefined) this.bvValue = input.bvValue;
    if (input.percentNfOver !== undefined)
      this.percentNfOver = input.percentNfOver;
    if (input.overValue !== undefined) this.overValue = input.overValue;
    if (input.realValue !== undefined) this.realValue = input.realValue;

    return this.computeDerivedValues();
  }

  private computeDerivedValues(): Result<BudgetLine> {
    if (this.supplierValue === null) {
      this.bvValue = null;
      this.overValue = null;
      this.realValue = null;
      return this.validate();
    }

    this.bvValue =
      this.percentBv !== null
        ? this.supplierValue * (this.percentBv / 100)
        : null;
    this.overValue =
      this.percentNfOver !== null
        ? this.supplierValue * (this.percentNfOver / 100)
        : null;
    this.realValue =
      this.supplierValue - (this.bvValue ?? 0) - (this.overValue ?? 0);

    return this.validate();
  }

  private validate(): Result<BudgetLine> {
    if (!this.budgetId?.trim())
      return Result.failure("Orçamento é obrigatório");
    if (!this.categoryCode?.trim())
      return Result.failure("Categoria da linha é obrigatória");
    if (!this.name?.trim())
      return Result.failure("Nome da linha é obrigatório");

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
    if (this.supplierValue !== null && this.supplierValue < 0)
      return Result.failure("Valor do fornecedor inválido");
    if (this.percentBv !== null && this.percentBv < 0)
      return Result.failure("Percentual de BV inválido");
    if (this.percentNfBv !== null && this.percentNfBv < 0)
      return Result.failure("Percentual de NF BV inválido");
    if (this.bvValue !== null && this.bvValue < 0)
      return Result.failure("Valor de BV inválido");
    if (this.percentNfOver !== null && this.percentNfOver < 0)
      return Result.failure("Percentual de NF over inválido");
    if (this.overValue !== null && this.overValue < 0)
      return Result.failure("Valor de over inválido");
    if (this.realValue !== null && this.realValue < 0)
      return Result.failure("Valor real inválido");

    this.budgetId = this.budgetId.trim();
    this.categoryCode = this.categoryCode.trim();
    this.name = this.name.trim();
    this.description = this.description?.trim() ?? "";
    this.supplier = this.supplier?.trim() ?? null;

    return Result.success(this);
  }
}
