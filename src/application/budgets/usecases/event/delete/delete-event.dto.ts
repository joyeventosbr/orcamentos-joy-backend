import { z } from "zod";

export const deleteEventSchema = z.object({
  id: z.string().trim().min(1),
});

export type DeleteEventDto = z.infer<typeof deleteEventSchema>;
