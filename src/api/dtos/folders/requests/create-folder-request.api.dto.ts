import { ApiProperty } from "@nestjs/swagger";

export class CreateFolderRequestApiDto {
  @ApiProperty()
  customerId!: string;

  @ApiProperty()
  name!: string;
}
