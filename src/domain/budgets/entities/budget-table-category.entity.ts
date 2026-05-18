import { BudgetCategory } from "@domain/budgets/entities/budget-category.entity";
import { BudgetTableRow } from "@domain/budgets/entities/budget-table-row.entity";

export class BudgetTableCategory {
  private constructor(
    public category: BudgetCategory,
    public rows: BudgetTableRow[],
  ) {}

  static read(input: {
    category: BudgetCategory;
    rows: BudgetTableRow[];
  }): BudgetTableCategory {
    return new BudgetTableCategory(input.category, input.rows);
  }
}
