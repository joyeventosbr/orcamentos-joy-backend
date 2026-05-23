import { Role } from "@domain/users/enums/user-role.enum";

export class UserListItemResponseDto {
  id!: string;
  name!: string;
  email!: string;
  role!: Role;
  funcao?: string;
  createdAt!: Date;
  updatedAt?: Date;
}
