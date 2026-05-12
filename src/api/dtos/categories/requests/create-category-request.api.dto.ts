import { ApiProperty } from "@nestjs/swagger";

export class CreateCategoryRequestApiDto {
  @ApiProperty()
  name!: string;

  @ApiProperty()
  code!: string;

  @ApiProperty()
  order!: number;
}
