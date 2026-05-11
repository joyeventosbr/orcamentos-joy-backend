import { ApiProperty } from "@nestjs/swagger";

export class UpdateCompanyRequestApiDto {
  @ApiProperty()
  name: string;
}
