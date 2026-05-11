import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { JwtStrategy } from "./jwt.strategy";
import { APP_GUARD } from "@nestjs/core";
import { JwtAuthGuard } from "./jwt.guard";
import { JwtTokenService } from "./jwt-token.service";

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: "1h" },
    }),
  ],
  providers: [
    JwtStrategy,
    {
      provide: "ITokenService",
      useClass: JwtTokenService,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
  exports: [JwtModule, "ITokenService"],
})
export class AuthJwtModule {}
