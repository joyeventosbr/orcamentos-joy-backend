import { z } from "zod";
import type { IValidationService } from "@application/shared/services/i-validation-service";

export const makeLoginUserSchema = (validationService: IValidationService) =>
  z.object({
    email: z
      .string()
      .trim()
      .refine((value) => validationService.isEmail(value), {
        message: "Formato do email inválido.",
      }),
    password: z.string(),
  });

export type LoginUserDto = z.infer<ReturnType<typeof makeLoginUserSchema>>;
