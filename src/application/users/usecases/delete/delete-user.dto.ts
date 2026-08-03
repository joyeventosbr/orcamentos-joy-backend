import { Role } from "@domain/users/enums/user-role.enum";
import { z } from "zod";

export const deleteUserSchema = z.object({
  id: z.string().trim().min(1),
  requesterId: z.string().trim().min(1),
  requesterRole: z.nativeEnum(Role),
});

export type DeleteUserDto = z.infer<typeof deleteUserSchema>;
