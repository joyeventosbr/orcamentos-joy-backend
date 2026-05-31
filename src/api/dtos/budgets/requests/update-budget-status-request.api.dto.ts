import { ApiProperty } from "@nestjs/swagger";
import { BudgetStatus } from "@domain/budgets/enums/budget-status.enum";

export class UpdateBudgetStatusRequestApiDto {
  @ApiProperty({ enum: BudgetStatus })
  status!: BudgetStatus;
}
