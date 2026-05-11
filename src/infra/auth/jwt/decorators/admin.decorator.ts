import { SetMetadata } from "@nestjs/common";
import { Role } from "@domain/users/types/user-role.type";

export const REQUIRED_ROLE_KEY = "requiredRole";
export const Admin = () => SetMetadata(REQUIRED_ROLE_KEY, Role.ADMIN);
