import { ApiProperty } from "@nestjs/swagger";

export class UpdateCustomerRequestApiDto {
  @ApiProperty()
  name!: string;
}
