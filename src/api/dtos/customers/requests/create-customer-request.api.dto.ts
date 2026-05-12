import { ApiProperty } from "@nestjs/swagger";

export class CreateCustomerRequestApiDto {
  @ApiProperty()
  name!: string;
}
