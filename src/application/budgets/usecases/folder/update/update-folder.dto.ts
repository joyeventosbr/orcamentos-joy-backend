import { z } from "zod";

export const updateFolderSchema = z.object({
  id: z.string().trim().min(1),
  customerId: z.string().trim().min(1).optional(),
  name: z.string().trim().min(1).optional(),
});

export type UpdateFolderDto = z.infer<typeof updateFolderSchema>;
