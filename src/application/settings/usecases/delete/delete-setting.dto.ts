import { z } from "zod";

export const deleteSettingSchema = z.object({
  id: z.string().trim().min(1),
});

export type DeleteSettingDto = z.infer<typeof deleteSettingSchema>;
