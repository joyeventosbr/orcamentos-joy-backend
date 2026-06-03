import { Inject, Injectable } from "@nestjs/common";
import type { IUserRepository } from "@domain/users/repositories/i-user-repository";
import { Result } from "@shared/result";
import { PasswordHasherService } from "@infra/auth/password/password-hasher.service";
import { ZError } from "@utils/index";
import { LoginUserResponseDto } from "@application/users/dtos/login/login-user-response.dto";
import { makeLoginUserSchema } from "./login-user.dto";
import type { ITokenService } from "@application/auth/services/i-token-service";
import type { IValidationService } from "@application/shared/services/i-validation-service";

@Injectable()
export class LoginUserUseCase {
  constructor(
    @Inject("IUserRepository")
    private readonly userRepository: IUserRepository,
    private readonly passwordHasherService: PasswordHasherService,
    @Inject("ITokenService")
    private readonly tokenService: ITokenService,
    @Inject("IValidationService")
    private readonly validationService: IValidationService,
  ) {}

  async execute(input: unknown): Promise<Result<LoginUserResponseDto>> {
    const resultData = makeLoginUserSchema(this.validationService).safeParse(
      input,
    );
    if (resultData.error) {
      if (ZError.create(resultData.error).errors.length > 0) {
        return Result.failure(ZError.create(resultData.error).errors[0]);
      }

      return Result.failure("Dados inválidos.");
    }

    const userResult = await this.userRepository.getByEmail(
      resultData.data.email,
    );
    if (userResult.isFailure()) {
      return Result.failure(userResult.getError());
    }

    const user = userResult.getValue();
    if (!user) {
      return Result.failure("Email ou senha inválidos");
    }

    const isValidPassword = await this.passwordHasherService.compare(
      resultData.data.password,
      user.password,
    );
    if (!isValidPassword) {
      return Result.failure("Email ou senha inválidos");
    }

    const token = await this.tokenService.generateToken({
      sub: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      funcao: user.funcao,
    });

    return Result.success({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
      token,
    });
  }
}
