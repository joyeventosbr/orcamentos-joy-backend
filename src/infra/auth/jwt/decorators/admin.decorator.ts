import { SetMetadata } from "@nestjs/common";
import { Role } from "@domain/users/enums/user-role.enum";

export const REQUIRED_ROLE_KEY = "requiredRole";
export const Admin = () => SetMetadata(REQUIRED_ROLE_KEY, Role.ADMIN);
