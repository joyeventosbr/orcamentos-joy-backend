import { ApiProperty } from "@nestjs/swagger";

export class CreateBudgetRequestApiDto {
  @ApiProperty()
  name!: string;

  @ApiProperty()
  customerId!: string;

  @ApiProperty()
  folderId!: string;
}
