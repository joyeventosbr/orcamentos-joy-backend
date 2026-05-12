import { z } from "zod";

export const deleteFolderSchema = z.object({
  id: z.string().trim().min(1),
});

export type DeleteFolderDto = z.infer<typeof deleteFolderSchema>;
