import { ApiProperty } from "@nestjs/swagger";

export class UpdateEventRequestApiDto {
  @ApiProperty()
  name: string;
}
