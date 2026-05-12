import { BillingType } from "@domain/budgets/types/billing-type.type";

export class BudgetTableRow {
  private constructor(
    public id: string,
    public parentId: string | null,
    public categoryId: string,
    public budgetId: string,
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
    public children: BudgetTableRow[],
  ) {}

  static read(input: {
    id: string;
    parentId: string | null;
    categoryId: string;
    budgetId: string;
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
    children: BudgetTableRow[];
  }): BudgetTableRow {
    return new BudgetTableRow(
      input.id,
      input.parentId,
      input.categoryId,
      input.budgetId,
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
      input.children,
    );
  }
}
