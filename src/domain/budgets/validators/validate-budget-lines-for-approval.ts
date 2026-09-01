import { BudgetLine } from "@domain/budgets/entities/budget-line.entity";
import { Result } from "@shared/result";

export function validateBudgetLinesForApproval(
  lines: BudgetLine[],
): Result<BudgetLine[]> {
  const missingNameCount = lines.filter((line) => !line.name?.trim()).length;

  if (missingNameCount > 0) {
    return Result.failure(
      `Preencha o nome de ${missingNameCount} item(ns) antes de aprovar`,
    );
  }

  return Result.success(lines);
}
