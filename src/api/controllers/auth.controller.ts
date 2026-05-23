import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Inject,
  Post,
  Res,
} from "@nestjs/common";
import { type FastifyReply } from "fastify";
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from "@nestjs/swagger";
import { RegisterUserUseCase } from "@application/users/usecases/register/register-user.usecase";
import { LoginUserUseCase } from "@application/users/usecases/login/login-user.usecase";
import { Public } from "@infra/auth/jwt/decorators/public.decorator";
import { Admin } from "@infra/auth/jwt/decorators/admin.decorator";
import { RegisterAdminUseCase } from "@application/users/usecases/register-admin/register-admin.usecase";
import { AuthResponseApiDto } from "@api/dtos/auth/responses/auth-response.api.dto";
import { LoginRequestApiDto } from "@api/dtos/auth/requests/login-request.api.dto";
import { RegisterAdminRequestApiDto } from "@api/dtos/auth/requests/register-admin-request.api.dto";
import { RegisterUserRequestApiDto } from "@api/dtos/auth/requests/register-user-request.api.dto";
import { UserListItemResponseApiDto } from "@api/dtos/auth/responses/user-list-item-response.api.dto";
import type { IUserRepository } from "@domain/users/repositories/i-user-repository";

@ApiTags("auth")
@ApiBearerAuth()
@Controller("auth")
export class AuthController {
  constructor(
    private readonly registerUserUseCase: RegisterUserUseCase,
    private readonly registerAdminUseCase: RegisterAdminUseCase,
    private readonly loginUserUseCase: LoginUserUseCase,
    @Inject("IUserRepository")
    private readonly userRepository: IUserRepository,
  ) {}

  @Admin()
  @Get("users")
  @ApiOkResponse({ type: [UserListItemResponseApiDto] })
  async getAllUsers(@Res() res: FastifyReply) {
    const result = await this.userRepository.getAll();

    if (result.isFailure()) {
      return res.status(HttpStatus.BAD_REQUEST).send({
        error: result.getError(),
      });
    }

    return res.status(HttpStatus.OK).send(result.getValue());
  }

  @Admin()
  @Post("register")
  @ApiBody({ type: RegisterUserRequestApiDto })
  @ApiCreatedResponse({ type: AuthResponseApiDto })
  async register(@Body() body: unknown, @Res() res: FastifyReply) {
    const result = await this.registerUserUseCase.execute(body);

    if (result.isFailure()) {
      return res.status(HttpStatus.BAD_REQUEST).send({
        error: result.getError(),
      });
    }

    return res.status(HttpStatus.CREATED).send(result.getValue());
  }

  @Admin()
  @Post("register-admin")
  @ApiBody({ type: RegisterAdminRequestApiDto })
  @ApiCreatedResponse({ type: AuthResponseApiDto })
  async registerAdmin(@Body() body: unknown, @Res() res: FastifyReply) {
    const result = await this.registerAdminUseCase.execute(body);

    if (result.isFailure()) {
      return res.status(HttpStatus.BAD_REQUEST).send({
        error: result.getError(),
      });
    }

    return res.status(HttpStatus.CREATED).send(result.getValue());
  }

  @Public()
  @Post("login")
  @ApiBody({ type: LoginRequestApiDto })
  @ApiOkResponse({ type: AuthResponseApiDto })
  async login(@Body() body: unknown, @Res() res: FastifyReply) {
    const result = await this.loginUserUseCase.execute(body);

    if (result.isFailure()) {
      return res.status(HttpStatus.UNAUTHORIZED).send({
        error: result.getError(),
      });
    }

    return res.status(HttpStatus.OK).send(result.getValue());
  }
}
