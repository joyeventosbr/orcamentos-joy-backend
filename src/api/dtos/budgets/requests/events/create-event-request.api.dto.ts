import { ApiProperty } from "@nestjs/swagger";

export class CreateEventRequestApiDto {
  @ApiProperty()
  companyId: string;

  @ApiProperty()
  name: string;
}
