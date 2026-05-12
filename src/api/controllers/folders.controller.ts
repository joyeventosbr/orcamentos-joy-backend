import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Res,
} from "@nestjs/common";
import { ApiBody, ApiTags } from "@nestjs/swagger";
import { type FastifyReply } from "fastify";
import { CreateFolderUseCase } from "@application/budgets/usecases/folder/create/create-folder.usecase";
import { DeleteFolderUseCase } from "@application/budgets/usecases/folder/delete/delete-folder.usecase";
import { GetAllFoldersUseCase } from "@application/budgets/usecases/folder/get-all/get-all-folders.usecase";
import { UpdateFolderUseCase } from "@application/budgets/usecases/folder/update/update-folder.usecase";
import { CreateFolderRequestApiDto } from "@api/dtos/folders/requests/create-folder-request.api.dto";
import { UpdateFolderRequestApiDto } from "@api/dtos/folders/requests/update-folder-request.api.dto";
import { Public } from "@infra/auth/jwt/decorators/public.decorator";

@ApiTags("folders")
@Controller("folders")
export class FoldersController {
  constructor(
    private readonly createFolderUseCase: CreateFolderUseCase,
    private readonly updateFolderUseCase: UpdateFolderUseCase,
    private readonly deleteFolderUseCase: DeleteFolderUseCase,
    private readonly getAllFoldersUseCase: GetAllFoldersUseCase,
  ) {}

  @Get()
  @Public()
  async getAll(@Res() res: FastifyReply) {
    const result = await this.getAllFoldersUseCase.execute();
    if (result.isFailure()) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .send({ error: result.getError() });
    }

    return res.status(HttpStatus.OK).send(result.getValue());
  }

  @Post()
  @Public()
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
  @Public()
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
  @Public()
  async delete(@Param("id") id: string, @Res() res: FastifyReply) {
    const result = await this.deleteFolderUseCase.execute({ id });
    if (result.isFailure()) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .send({ error: result.getError() });
    }

    return res.status(HttpStatus.OK).send({ success: true });
  }
}
