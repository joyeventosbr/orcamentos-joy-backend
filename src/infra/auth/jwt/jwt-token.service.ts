import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { type ITokenService } from "@application/auth/services/i-token-service";
import type { GenerateTokenInputDto } from "@application/auth/dtos/generate-token-input.dto";

@Injectable()
export class JwtTokenService implements ITokenService {
  constructor(private readonly jwtService: JwtService) {}

  async generateToken(payload: GenerateTokenInputDto): Promise<string> {
    return this.jwtService.signAsync(payload);
  }
}
