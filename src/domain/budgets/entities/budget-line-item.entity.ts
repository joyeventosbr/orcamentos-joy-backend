import { Result } from "@shared/result";
import { BillingType } from "@domain/budgets/types/billing-type.type";

export class BudgetLineItem {
  private constructor(
    public id: string,
    public budgetId: string,
    public categoryId: string,
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
    id?: string;
    budgetId?: string;
    categoryId: string;
    parentId?: string | null;
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
  }): Result<BudgetLineItem> {
    if (!input.categoryId?.trim()) {
      return Result.failure("Categoria da linha é obrigatória");
    }

    if (!input.name?.trim()) {
      return Result.failure("Nome da linha é obrigatório");
    }

    if (input.order < 0) return Result.failure("Ordem da linha inválida");
    if (input.quantity < 0) return Result.failure("Quantidade inválida");
    if (input.dailyRates < 0) return Result.failure("Diárias inválidas");
    if (input.unitValue < 0) return Result.failure("Valor unitário inválido");
    if (input.totalValue < 0) return Result.failure("Valor total inválido");

    return Result.success(
      new BudgetLineItem(
        input.id ?? "",
        input.budgetId ?? "",
        input.categoryId.trim(),
        input.parentId ?? null,
        input.order,
        input.name.trim(),
        input.description?.trim() ?? "",
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
      ),
    );
  }

  static read(input: {
    id: string;
    budgetId: string;
    categoryId: string;
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
  }): BudgetLineItem {
    return new BudgetLineItem(
      input.id,
      input.budgetId,
      input.categoryId,
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
}
