import { ApiProperty } from "@nestjs/swagger";

export class RegisterUserRequestApiDto {
  @ApiProperty()
  name!: string;

  @ApiProperty()
  email!: string;

  @ApiProperty()
  password!: string;

  @ApiProperty()
  cdCliente!: string;
}
