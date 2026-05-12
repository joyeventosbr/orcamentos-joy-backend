import { z } from "zod";

export const createFolderSchema = z.object({
  customerId: z.string().trim().min(1),
  name: z.string().trim().min(1),
});

export type CreateFolderDto = z.infer<typeof createFolderSchema>;
