import { ApiProperty } from "@nestjs/swagger";

export class RegisterAdminRequestApiDto {
  @ApiProperty()
  name!: string;

  @ApiProperty()
  email!: string;

  @ApiProperty()
  password!: string;
}
