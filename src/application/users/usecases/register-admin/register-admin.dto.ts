import { z } from "zod";
import type { IValidationService } from "@application/shared/services/i-validation-service";

export const makeRegisterAdminSchema = (
  validationService: IValidationService,
) =>
  z.object({
    name: z.string().trim().min(3),
    email: z
      .string()
      .trim()
      .refine((value) => validationService.isEmail(value), {
        message: "Formato do email inválido.",
      }),
    password: z.string(),
  });

export type RegisterAdminDto = z.infer<
  ReturnType<typeof makeRegisterAdminSchema>
>;
