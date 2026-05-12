import {
  Body,
  Controller,
  Delete,
  HttpStatus,
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
import { CreateCategoryRequestApiDto } from "@api/dtos/categories/requests/create-category-request.api.dto";
import { UpdateCategoryRequestApiDto } from "@api/dtos/categories/requests/update-category-request.api.dto";

@ApiTags("categories")
@Controller("budgets/categories")
export class CategoriesController {
  constructor(
    private readonly createCategoryUseCase: CreateCategoryUseCase,
    private readonly updateCategoryUseCase: UpdateCategoryUseCase,
    private readonly deleteCategoryUseCase: DeleteCategoryUseCase,
  ) {}

  @Post()
  @ApiBody({ type: CreateCategoryRequestApiDto })
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
