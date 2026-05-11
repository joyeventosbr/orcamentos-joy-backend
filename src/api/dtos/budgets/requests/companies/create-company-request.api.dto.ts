import { ApiProperty } from "@nestjs/swagger";

export class CreateCompanyRequestApiDto {
  @ApiProperty()
  name: string;
}
