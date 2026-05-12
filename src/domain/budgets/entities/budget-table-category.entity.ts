import { BudgetCategory } from "./budget-category.entity";
import { BudgetTableRow } from "./budget-table-row.entity";

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
