import { DataSource } from "typeorm";
import { UserSchema } from "@infra/database/typeorm/schemas/user.schema";
import { UnauthorizedException } from "@nestjs/common";
import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { JwtPayload } from "./jwt.type";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly db: DataSource) {
    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
      throw new Error("JWT_SECRET não definido");
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET || "",
    });
  }

  async validate(payload: JwtPayload) {
    const current = await this.db
      .getRepository(UserSchema)
      .findOneBy({ id: payload.sub });
    if (!current || !current.isActive)
      throw new UnauthorizedException("Acesso desativado");
    return {
      sub: payload.sub,
      userId: payload.sub,
      name: payload.name,
      email: payload.email,
      role: current.role,
      folderIds: current.folderIds,
      roleDescription: payload.roleDescription,
    };
  }
}
