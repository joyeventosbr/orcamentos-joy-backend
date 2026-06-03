import { Inject, Injectable } from "@nestjs/common";
import { User } from "@domain/users/entities/user/user.entity";
import type { IUserRepository } from "@domain/users/repositories/i-user-repository";
import { Role } from "@domain/users/enums/user-role.enum";
import { Result } from "@shared/result";
import { PasswordHasherService } from "@infra/auth/password/password-hasher.service";
import { ZError } from "@utils/index";
import type { ITokenService } from "@application/auth/services/i-token-service";
import type { IValidationService } from "@application/shared/services/i-validation-service";
import { makeRegisterAdminSchema } from "./register-admin.dto";

type RegisterAdminResponse = {
  user: {
    id: string;
    name: string;
    email: string;
    role: Role;
    createdAt: Date;
  };
  token: string;
};

@Injectable()
export class RegisterAdminUseCase {
  constructor(
    @Inject("IUserRepository")
    private readonly userRepository: IUserRepository,
    private readonly passwordHasherService: PasswordHasherService,
    @Inject("ITokenService")
    private readonly tokenService: ITokenService,
    @Inject("IValidationService")
    private readonly validationService: IValidationService,
  ) {}

  async execute(input: unknown): Promise<Result<RegisterAdminResponse>> {
    const resultData = makeRegisterAdminSchema(
      this.validationService,
    ).safeParse(input);

    if (resultData.error) {
      if (ZError.create(resultData.error).errors.length > 0) {
        return Result.failure(ZError.create(resultData.error).errors[0]);
      }

      return Result.failure("Dados inválidos.");
    }

    const existsResult = await this.userRepository.getByEmail(
      resultData.data.email,
    );

    if (existsResult.isFailure()) {
      return Result.failure(existsResult.getError());
    }

    if (existsResult.getValue() && existsResult.getValue()?.email) {
      return Result.failure("Já existe um usuário com este email");
    }

    const newUser = User.create({
      name: resultData.data.name,
      email: resultData.data.email,
      password: await this.passwordHasherService.hash(resultData.data.password),
      role: Role.ADMIN,
    });

    if (newUser.isFailure()) {
      return Result.failure(newUser.getError());
    }

    const createResult = await this.userRepository.create(newUser.getValue());

    if (createResult.isFailure()) {
      return Result.failure(createResult.getError());
    }

    const user = createResult.getValue();
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
