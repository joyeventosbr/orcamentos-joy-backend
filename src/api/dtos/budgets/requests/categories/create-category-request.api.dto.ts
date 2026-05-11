import { ApiProperty } from "@nestjs/swagger";

export class CreateCategoryRequestApiDto {
  @ApiProperty()
  budgetId: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  code: string;

  @ApiProperty()
  order: number;
}
