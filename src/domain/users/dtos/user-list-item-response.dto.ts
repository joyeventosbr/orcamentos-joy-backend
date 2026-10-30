import { Role } from "@domain/users/enums/user-role.enum";

export class UserListItemResponseDto {
  isActive!: boolean;
  folderIds!: string[];
  id!: string;
  name!: string;
  email!: string;
  role!: Role;
  roleDescription?: string;
  createdAt!: Date;
  updatedAt?: Date;
}
