import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { CreateBudgetLineRequestApiDto } from "../create-budget-line-request.api.dto";
import { BulkUpdateBudgetLineUpdateItemRequestApiDto } from "./bulk-update-budget-line-update-item-request.api.dto";

export class BulkUpdateBudgetLinesRequestApiDto {
  @ApiProperty()
  budgetId!: string;

  @ApiPropertyOptional({ type: [CreateBudgetLineRequestApiDto] })
  create?: CreateBudgetLineRequestApiDto[];

  @ApiPropertyOptional({ type: [BulkUpdateBudgetLineUpdateItemRequestApiDto] })
  update?: BulkUpdateBudgetLineUpdateItemRequestApiDto[];

  @ApiPropertyOptional({ type: [String] })
  delete?: string[];
}
