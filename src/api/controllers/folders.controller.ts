import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Inject,
  Param,
  Post,
  Put,
  Res,
} from "@nestjs/common";
import { ApiBody, ApiTags } from "@nestjs/swagger";
import { type FastifyReply } from "fastify";
import { CreateFolderUseCase } from "@application/budgets/usecases/folder/create/create-folder.usecase";
import { DeleteFolderUseCase } from "@application/budgets/usecases/folder/delete/delete-folder.usecase";
import { UpdateFolderUseCase } from "@application/budgets/usecases/folder/update/update-folder.usecase";
import type { IFolderRepository } from "@domain/folders/repositories/i-folder-repository";
import { CreateFolderRequestApiDto } from "@api/dtos/folders/requests/create-folder-request.api.dto";
import { UpdateFolderRequestApiDto } from "@api/dtos/folders/requests/update-folder-request.api.dto";
import { User } from "@infra/auth/jwt/decorators/user.decorator";
import type { JwtPayload } from "@infra/auth/jwt/jwt.type";
import { Role } from "@domain/users/enums/user-role.enum";
import { TemporaryAccessService } from "@infra/auth/jwt/temporary-access.service";
import { Admin } from "@infra/auth/jwt/decorators/admin.decorator";

@ApiTags("folders")
@Controller("folders")
export class FoldersController {
  constructor(
    private readonly access: TemporaryAccessService,
    private readonly createFolderUseCase: CreateFolderUseCase,
    private readonly updateFolderUseCase: UpdateFolderUseCase,
    private readonly deleteFolderUseCase: DeleteFolderUseCase,
    @Inject("IFolderRepository")
    private readonly folderRepository: IFolderRepository,
  ) {}

  @Get()
  async getAll(@User() user: JwtPayload, @Res() res: FastifyReply) {
    const result = await this.folderRepository.getAll();
    if (result.isFailure()) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .send({ error: result.getError() });
    }

    const items = result.getValue();
    const allowed =
      user.role === Role.TEMPORARY ? (user.folderIds ?? []) : null;
    return res
      .status(HttpStatus.OK)
      .send(
        allowed ? items.filter((item) => allowed.includes(item.id)) : items,
      );
  }

  @Post()
  @ApiBody({ type: CreateFolderRequestApiDto })
  async create(@Body() body: unknown, @Res() res: FastifyReply) {
    const result = await this.createFolderUseCase.execute(body);
    if (result.isFailure()) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .send({ error: result.getError() });
    }

    return res.status(HttpStatus.CREATED).send(result.getValue());
  }

  @Put(":id")
  @ApiBody({ type: UpdateFolderRequestApiDto })
  async update(
    @Param("id") id: string,
    @Body() body: unknown,
    @Res() res: FastifyReply,
  ) {
    const result = await this.updateFolderUseCase.execute({
      ...(body as object),
      id,
    });
    if (result.isFailure()) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .send({ error: result.getError() });
    }

    return res.status(HttpStatus.OK).send(result.getValue());
  }

  @Delete(":id")
  @Admin()
  async delete(@Param("id") id: string, @Res() res: FastifyReply) {
    const result = await this.deleteFolderUseCase.execute({ id });
    if (result.isFailure()) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .send({ error: result.getError() });
    }

    return res.status(HttpStatus.NO_CONTENT).send();
  }
}
