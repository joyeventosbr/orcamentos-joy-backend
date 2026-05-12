import { ApiProperty } from "@nestjs/swagger";
import { BudgetLineItemRequestApiDto } from "./budget-line-item-request.api.dto";

export class CreateBudgetRequestApiDto {
  @ApiProperty()
  folderId!: string;

  @ApiProperty()
  client!: string;

  @ApiProperty()
  job!: string;

  @ApiProperty()
  deadline!: string;

  @ApiProperty()
  location!: string;

  @ApiProperty()
  folderDate!: string;

  @ApiProperty()
  participants!: number;

  @ApiProperty({ type: [BudgetLineItemRequestApiDto] })
  items!: BudgetLineItemRequestApiDto[];
}
