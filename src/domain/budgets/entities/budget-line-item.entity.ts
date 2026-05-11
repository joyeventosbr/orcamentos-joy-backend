import { BillingType } from "@domain/budgets/types/billing-type.type";

export class BudgetLineItem {
  constructor(
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
}
