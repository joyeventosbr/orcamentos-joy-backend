export class BudgetCategory {
  constructor(
    public id: string,
    public budgetId: string,
    public name: string,
    public code: string,
    public order: number,
  ) {}
}
