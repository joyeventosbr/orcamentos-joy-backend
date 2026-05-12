import { z } from "zod";

export const updateFolderSchema = z.object({
  id: z.string().trim().min(1),
  name: z.string().trim().min(1),
});

export type UpdateFolderDto = z.infer<typeof updateFolderSchema>;
