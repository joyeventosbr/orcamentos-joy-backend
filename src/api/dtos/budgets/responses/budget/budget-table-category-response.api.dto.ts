import { ApiProperty } from "@nestjs/swagger";
import { BudgetCategoryInfoResponseApiDto } from "./budget-category-info-response.api.dto";
import { BudgetTableRowResponseApiDto } from "./budget-table-row-response.api.dto";

export class BudgetTableCategoryResponseApiDto {
  @ApiProperty({ type: BudgetCategoryInfoResponseApiDto })
  category!: BudgetCategoryInfoResponseApiDto;

  @ApiProperty({ type: [BudgetTableRowResponseApiDto] })
  rows!: BudgetTableRowResponseApiDto[];
}
