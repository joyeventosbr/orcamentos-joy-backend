import { ApiProperty } from "@nestjs/swagger";

export class CreateBudgetRequestApiDto {
  @ApiProperty()
  customerId!: string;

  @ApiProperty()
  folderId!: string;
}
