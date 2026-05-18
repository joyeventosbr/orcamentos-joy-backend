import { Role } from "@domain/users/enums/user-role.enum";

export class LoginUserResponseDto {
  user: {
    id: string;
    name: string;
    email: string;
    role: Role;
    createdAt: Date;
  };
  token: string;
}
