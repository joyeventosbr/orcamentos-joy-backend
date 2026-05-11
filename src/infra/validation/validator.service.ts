import { Injectable } from "@nestjs/common";
import validator from "validator";
import type { IValidationService } from "@application/shared/services/i-validation-service";

@Injectable()
export class ValidatorService implements IValidationService {
  isEmail(value: string): boolean {
    return validator.isEmail(value);
  }
}
