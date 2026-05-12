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
import { ApiBody, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { type FastifyReply } from "fastify";
import { CreateBudgetUseCase } from "@application/budgets/usecases/budget/create/create-budget.usecase";
import { DeleteBudgetUseCase } from "@application/budgets/usecases/budget/delete/delete-budget.usecase";
import { ExportBudgetUseCase } from "@application/budgets/usecases/budget/export/export-budget.usecase";
import { GetBudgetUseCase } from "@application/budgets/usecases/budget/get/get-budget.usecase";
import { UpdateBudgetUseCase } from "@application/budgets/usecases/budget/update/update-budget.usecase";
import type { IBudgetRepository } from "@domain/budgets/repositories/budget/i-budget-repository";
import { CreateBudgetRequestApiDto } from "@api/dtos/budgets/requests/create-budget-request.api.dto";
import { UpdateBudgetRequestApiDto } from "@api/dtos/budgets/requests/update-budget-request.api.dto";
import { BudgetDetailResponseApiDto } from "@api/dtos/budgets/responses/budget/budget-detail-response.api.dto";
import { ExportBudgetResponseApiDto } from "@api/dtos/budgets/responses/export-budget-response.api.dto";

@ApiTags("budgets")
@Controller("budgets")
export class BudgetsController {
  constructor(
    private readonly createBudgetUseCase: CreateBudgetUseCase,
    private readonly updateBudgetUseCase: UpdateBudgetUseCase,
    private readonly deleteBudgetUseCase: DeleteBudgetUseCase,
    private readonly exportBudgetUseCase: ExportBudgetUseCase,
    private readonly getBudgetUseCase: GetBudgetUseCase,
    @Inject("IBudgetRepository")
    private readonly budgetRepository: IBudgetRepository,
  ) {}

  @Get()
  async getAll(@Res() res: FastifyReply) {
    const result = await this.budgetRepository.getAll();

    if (result.isFailure()) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .send({ error: result.getError() });
    }

    return res.status(HttpStatus.OK).send(result.getValue());
  }

  @Post()
  @ApiBody({ type: CreateBudgetRequestApiDto })
  async create(@Body() body: unknown, @Res() res: FastifyReply) {
    const result = await this.createBudgetUseCase.execute(body);

    if (result.isFailure()) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .send({ error: result.getError() });
    }

    return res.status(HttpStatus.CREATED).send(result.getValue());
  }

  @Put(":id")
  @ApiBody({ type: UpdateBudgetRequestApiDto })
  async update(
    @Param("id") id: string,
    @Body() body: unknown,
    @Res() res: FastifyReply,
  ) {
    const result = await this.updateBudgetUseCase.execute({
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
    const result = await this.deleteBudgetUseCase.execute({ id });

    if (result.isFailure()) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .send({ error: result.getError() });
    }

    return res.status(HttpStatus.OK).send({ success: true });
  }

  @Get(":id")
  @ApiOkResponse({ type: BudgetDetailResponseApiDto })
  async get(@Param("id") id: string, @Res() res: FastifyReply) {
    const result = await this.getBudgetUseCase.execute({ id });

    if (result.isFailure()) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .send({ error: result.getError() });
    }

    return res.status(HttpStatus.OK).send(result.getValue());
  }

  @Get(":id/export")
  @ApiOkResponse({ type: ExportBudgetResponseApiDto })
  async export(@Param("id") id: string, @Res() res: FastifyReply) {
    const result = await this.exportBudgetUseCase.execute({ id });

    if (result.isFailure()) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .send({ error: result.getError() });
    }

    return res.status(HttpStatus.OK).send(result.getValue());
  }
}
