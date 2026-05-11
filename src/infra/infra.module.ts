import { Module } from "@nestjs/common";
import { RateLimitModule } from "./rate-limit/rate-limit.module";
import { DatabaseModule } from "./database/database.module";
import { AuthJwtModule } from "./auth/jwt/jwt.module";
import { PasswordHasherService } from "./auth/password/password-hasher.service";
import { ValidatorService } from "./validation/validator.service";

@Module({
  imports: [RateLimitModule, DatabaseModule, AuthJwtModule],
  providers: [
    PasswordHasherService,
    {
      provide: "IValidationService",
      useClass: ValidatorService,
    },
  ],
  exports: [
    RateLimitModule,
    DatabaseModule,
    AuthJwtModule,
    PasswordHasherService,
    "IValidationService",
  ],
})
export class InfraModule {}
