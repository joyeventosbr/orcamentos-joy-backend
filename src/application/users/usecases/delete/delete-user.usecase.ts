import { Inject, Injectable } from "@nestjs/common";
import { Role } from "@domain/users/enums/user-role.enum";
import type { IUserRepository } from "@domain/users/repositories/i-user-repository";
import { Result } from "@shared/result";
import { ZError } from "@utils/index";
import { deleteUserSchema } from "./delete-user.dto";

@Injectable()
export class DeleteUserUseCase {
  constructor(
    @Inject("IUserRepository")
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(input: unknown): Promise<Result<void>> {
    const parsed = deleteUserSchema.safeParse(input);
    if (!parsed.success) {
      const errors = ZError.create(parsed.error).errors;
      return Result.failure(errors[0] ?? "Dados inválidos");
    }

    if (parsed.data.requesterRole !== Role.ADMIN) {
      return Result.failure("Somente admin pode deletar usuários");
    }

    if (parsed.data.id === parsed.data.requesterId) {
      return Result.failure("Admin não pode deletar o próprio usuário");
    }

    const user = await this.userRepository.getById(parsed.data.id);
    if (user.isFailure()) return Result.failure(user.getError());
    if (!user.getValue()) return Result.failure("Usuário não encontrado");

    const deleted = await this.userRepository.delete(parsed.data.id);
    if (deleted.isFailure()) return Result.failure(deleted.getError());

    return Result.success(undefined);
  }
}
