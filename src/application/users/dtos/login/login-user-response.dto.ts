import { Role } from "@domain/users/types/user-role.type";

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
