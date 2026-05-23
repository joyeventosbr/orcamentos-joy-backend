import { z } from "zod";

export const createSettingSchema = z.object({
  key: z.string().trim().min(1),
  value: z.string().trim().min(1),
});

export type CreateSettingDto = z.infer<typeof createSettingSchema>;
