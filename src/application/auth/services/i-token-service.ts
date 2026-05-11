import type { GenerateTokenInputDto } from "../dtos/generate-token-input.dto";

export interface ITokenService {
  generateToken(payload: GenerateTokenInputDto): Promise<string>;
}
