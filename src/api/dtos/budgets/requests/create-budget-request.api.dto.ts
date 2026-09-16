import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateBudgetRequestApiDto {
  @ApiProperty()
  name!: string;

  @ApiProperty()
  customerId!: string;

  @ApiProperty()
  folderId!: string;

  @ApiPropertyOptional({ nullable: true, minimum: 0 })
  honorariumPercentage?: number | null;

  @ApiPropertyOptional({ nullable: true, minimum: 0 })
  honorariumMinimumFee?: number | null;
}
