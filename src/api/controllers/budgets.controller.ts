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
import { UpdateBudgetUseCase } from "@application/budgets/usecases/budget/update/update-budget.usecase";
import type { IBudgetRepository } from "@domain/budgets/repositories/i-budget-repository";
import { CreateBudgetRequestApiDto } from "@api/dtos/budgets/requests/create-budget-request.api.dto";
import { UpdateBudgetRequestApiDto } from "@api/dtos/budgets/requests/update-budget-request.api.dto";
import { ExportBudgetResponseApiDto } from "@api/dtos/budgets/responses/export-budget-response.api.dto";
import { Public } from "@infra/auth/jwt/decorators/public.decorator";

@ApiTags("budgets")
@Controller("budgets")
export class BudgetsController {
  constructor(
    private readonly createBudgetUseCase: CreateBudgetUseCase,
    private readonly updateBudgetUseCase: UpdateBudgetUseCase,
    private readonly deleteBudgetUseCase: DeleteBudgetUseCase,
    private readonly exportBudgetUseCase: ExportBudgetUseCase,
    @Inject("IBudgetRepository")
    private readonly budgetRepository: IBudgetRepository,
  ) {}

  @Get()
  @Public()
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
  @Public()
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

  @Get(":id/details")
  @Public()
  async getDetails(@Param("id") id: string, @Res() res: FastifyReply) {
    const budgetResult = await this.budgetRepository.getByIdWithLines(id);

    if (budgetResult.isFailure()) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .send({ error: budgetResult.getError() });
    }

    const budget = budgetResult.getValue();
    if (!budget) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .send({ error: "Orçamento não encontrado" });
    }

    return res.status(HttpStatus.OK).send(budget);
  }

  @Get(":id")
  @Public()
  async get(@Param("id") id: string, @Res() res: FastifyReply) {
    const result = await this.budgetRepository.getById(id);

    if (result.isFailure()) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .send({ error: result.getError() });
    }

    const budget = result.getValue();
    if (!budget) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .send({ error: "Orçamento não encontrado" });
    }

    return res.status(HttpStatus.OK).send(budget);
  }
}
