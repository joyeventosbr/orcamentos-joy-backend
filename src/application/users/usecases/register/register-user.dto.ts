import { z } from "zod";
import type { IValidationService } from "@application/shared/services/i-validation-service";

export const makeRegisterUserSchema = (validationService: IValidationService) =>
  z.object({
    name: z.string().trim().min(3),
    email: z
      .string()
      .trim()
      .refine((value) => validationService.isEmail(value), {
        message: "Formato do email inválido.",
      }),
    password: z.string(),
    funcao: z.string().trim().min(1),
  });

export type RegisterUserDto = z.infer<
  ReturnType<typeof makeRegisterUserSchema>
>;
