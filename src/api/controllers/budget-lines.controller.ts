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
import { CreateBudgetLineUseCase } from "@application/budgets/usecases/budget-line/create/create-budget-line.usecase";
import { UpdateBudgetLineUseCase } from "@application/budgets/usecases/budget-line/update/update-budget-line.usecase";
import { DeleteBudgetLineUseCase } from "@application/budgets/usecases/budget-line/delete/delete-budget-line.usecase";
import type { IBudgetLineRepository } from "@domain/budgets/repositories/i-budget-line-repository";
import { CreateBudgetLineRequestApiDto } from "@api/dtos/budget-lines/requests/create-budget-line-request.api.dto";
import { UpdateBudgetLineRequestApiDto } from "@api/dtos/budget-lines/requests/update-budget-line-request.api.dto";

@ApiTags("budget-lines")
@Controller("budget-lines")
export class BudgetLinesController {
  constructor(
    private readonly createBudgetLineUseCase: CreateBudgetLineUseCase,
    private readonly updateBudgetLineUseCase: UpdateBudgetLineUseCase,
    private readonly deleteBudgetLineUseCase: DeleteBudgetLineUseCase,
    @Inject("IBudgetLineRepository")
    private readonly budgetLineRepository: IBudgetLineRepository,
  ) {}

  @Get("budget/:budgetId")
  async getAllByBudget(
    @Param("budgetId") budgetId: string,
    @Res() res: FastifyReply,
  ) {
    const result = await this.budgetLineRepository.getAllByBudgetId(budgetId);

    if (result.isFailure()) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .send({ error: result.getError() });
    }

    return res.status(HttpStatus.OK).send(result.getValue());
  }

  @Post()
  @ApiBody({ type: CreateBudgetLineRequestApiDto })
  async create(@Body() body: unknown, @Res() res: FastifyReply) {
    const result = await this.createBudgetLineUseCase.execute(body);

    if (result.isFailure()) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .send({ error: result.getError() });
    }

    return res.status(HttpStatus.CREATED).send(result.getValue());
  }

  @Put(":id")
  @ApiBody({ type: UpdateBudgetLineRequestApiDto })
  async update(
    @Param("id") id: string,
    @Body() body: unknown,
    @Res() res: FastifyReply,
  ) {
    const result = await this.updateBudgetLineUseCase.execute({
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
    const result = await this.deleteBudgetLineUseCase.execute({ id });

    if (result.isFailure()) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .send({ error: result.getError() });
    }

    return res.status(HttpStatus.NO_CONTENT).send();
  }
}
