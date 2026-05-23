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
import { CreateCategoryUseCase } from "@application/budgets/usecases/category/create/create-category.usecase";
import { DeleteCategoryUseCase } from "@application/budgets/usecases/category/delete/delete-category.usecase";
import { UpdateCategoryUseCase } from "@application/budgets/usecases/category/update/update-category.usecase";
import type { ICategoryRepository } from "@domain/budgets/repositories/i-category-repository";
import { CreateCategoryRequestApiDto } from "@api/dtos/categories/requests/create-category-request.api.dto";
import { UpdateCategoryRequestApiDto } from "@api/dtos/categories/requests/update-category-request.api.dto";
import { Public } from "@infra/auth/jwt/decorators/public.decorator";

@ApiTags("categories")
@Controller("categories")
export class CategoriesController {
  constructor(
    private readonly createCategoryUseCase: CreateCategoryUseCase,
    private readonly updateCategoryUseCase: UpdateCategoryUseCase,
    private readonly deleteCategoryUseCase: DeleteCategoryUseCase,
    @Inject("ICategoryRepository")
    private readonly categoryRepository: ICategoryRepository,
  ) {}

  @Get()
  @Public()
  async getAll(@Res() res: FastifyReply) {
    const result = await this.categoryRepository.getAll();
    if (result.isFailure()) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .send({ error: result.getError() });
    }

    return res.status(HttpStatus.OK).send(result.getValue());
  }

  @Post()
  @ApiBody({ type: CreateCategoryRequestApiDto })
  @Public()
  async create(@Body() body: unknown, @Res() res: FastifyReply) {
    const result = await this.createCategoryUseCase.execute(body);
    if (result.isFailure()) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .send({ error: result.getError() });
    }

    return res.status(HttpStatus.CREATED).send(result.getValue());
  }

  @Put(":id")
  @ApiBody({ type: UpdateCategoryRequestApiDto })
  @Public()
  async update(
    @Param("id") id: string,
    @Body() body: unknown,
    @Res() res: FastifyReply,
  ) {
    const result = await this.updateCategoryUseCase.execute({
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
    const result = await this.deleteCategoryUseCase.execute({ id });
    if (result.isFailure()) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .send({ error: result.getError() });
    }

    return res.status(HttpStatus.OK).send({ success: true });
  }
}
