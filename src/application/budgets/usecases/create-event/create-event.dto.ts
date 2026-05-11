import { z } from "zod";

export const createEventSchema = z.object({
  companyId: z.string().trim().min(1),
  name: z.string().trim().min(1),
});

export type CreateEventDto = z.infer<typeof createEventSchema>;
