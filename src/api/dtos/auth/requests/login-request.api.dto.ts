import { ApiProperty } from "@nestjs/swagger";

export class LoginRequestApiDto {
  @ApiProperty()
  email!: string;

  @ApiProperty()
  password!: string;
}
