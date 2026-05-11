import { ZodError } from "zod";

export class ZError {
  constructor(public readonly errors: string[]) {}

  static create(result: unknown): ZError {
    const errors: string[] = [];

    if (result instanceof ZodError) {
      result.issues.map((e) => {
        const campo = e.path.join(".") || "body";

        switch (e.code) {
          case "invalid_type":
            if (e.input === "undefined") {
              errors.push(`${campo} is required.`);
            } else {
              errors.push(`Formato do ${campo} inválido.`);
            }
            break;

          case "too_small":
            errors.push(
              `${campo} precisa ter pelo menos ${e.minimum} caracteres.`,
            );
            break;

          case "too_big":
            errors.push(
              `${campo} exceeds the limit of ${e.maximum} characters.`,
            );
            break;

          case "invalid_value":
            errors.push(`Formato do ${campo} inválido.`);
            break;

          case "custom":
          default:
            errors.push(e.message || `Error on field ${campo}.`);
            break;
        }
      });
    }

    return new ZError(errors);
  }
}
