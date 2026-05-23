import { z } from "zod";

export const updateSettingSchema = z.object({
  id: z.string().trim().min(1),
  key: z.string().trim().min(1).optional(),
  value: z.string().trim().min(1).optional(),
});

export type UpdateSettingDto = z.infer<typeof updateSettingSchema>;
