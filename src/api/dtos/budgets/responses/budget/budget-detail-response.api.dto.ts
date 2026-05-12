import { ApiProperty } from "@nestjs/swagger";
import { BudgetTableCategoryResponseApiDto } from "./budget-table-category-response.api.dto";

export class BudgetDetailResponseApiDto {
  @ApiProperty()
  id!: string;

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

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty({ required: false })
  updatedAt?: Date;

  @ApiProperty({ type: [BudgetTableCategoryResponseApiDto] })
  table!: BudgetTableCategoryResponseApiDto[];
}
