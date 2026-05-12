import { ApiPropertyOptional } from "@nestjs/swagger";
import { BudgetLineItemRequestApiDto } from "./budget-line-item-request.api.dto";

export class UpdateBudgetRequestApiDto {
  @ApiPropertyOptional()
  folderId?: string;

  @ApiPropertyOptional()
  client?: string;

  @ApiPropertyOptional()
  job?: string;

  @ApiPropertyOptional()
  deadline?: string;

  @ApiPropertyOptional()
  location?: string;

  @ApiPropertyOptional()
  folderDate?: string;

  @ApiPropertyOptional()
  participants?: number;

  @ApiPropertyOptional({ type: [BudgetLineItemRequestApiDto] })
  items?: BudgetLineItemRequestApiDto[];
}
