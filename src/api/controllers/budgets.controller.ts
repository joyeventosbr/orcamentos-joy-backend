import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Inject,
  Patch,
  Param,
  Post,
  Put,
  Res,
} from "@nestjs/common";
import { ApiBody, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { type FastifyReply } from "fastify";
import { CreateBudgetUseCase } from "@application/budgets/usecases/budget/create/create-budget.usecase";
import { CopyBudgetUseCase } from "@application/budgets/usecases/budget/copy/copy-budget.usecase";
import { DeleteBudgetUseCase } from "@application/budgets/usecases/budget/delete/delete-budget.usecase";
import { ExportBudgetUseCase } from "@application/budgets/usecases/budget/export/export-budget.usecase";
import { UpdateBudgetUseCase } from "@application/budgets/usecases/budget/update/update-budget.usecase";
import { ApproveBudgetUseCase } from "@application/budgets/usecases/budget/approve/approve-budget.usecase";
import type { IBudgetRepository } from "@domain/budgets/repositories/i-budget-repository";
import { CreateBudgetRequestApiDto } from "@api/dtos/budgets/requests/create-budget-request.api.dto";
import { UpdateBudgetRequestApiDto } from "@api/dtos/budgets/requests/update-budget-request.api.dto";
import { ExportBudgetResponseApiDto } from "@api/dtos/budgets/responses/export-budget-response.api.dto";
import { User } from "@infra/auth/jwt/decorators/user.decorator";
import type { JwtPayload } from "@infra/auth/jwt/jwt.type";
import { Role } from "@domain/users/enums/user-role.enum";

@ApiTags("budgets")
@Controller("budgets")
export class BudgetsController {
  constructor(
    private readonly createBudgetUseCase: CreateBudgetUseCase,
    private readonly copyBudgetUseCase: CopyBudgetUseCase,
    private readonly updateBudgetUseCase: UpdateBudgetUseCase,
    private readonly approveBudgetUseCase: ApproveBudgetUseCase,
    private readonly deleteBudgetUseCase: DeleteBudgetUseCase,
    private readonly exportBudgetUseCase: ExportBudgetUseCase,
    @Inject("IBudgetRepository")
    private readonly budgetRepository: IBudgetRepository,
  ) {}

  @Get()
  async getAll(@User() user: JwtPayload, @Res() res: FastifyReply) {
    const result = await this.budgetRepository.getAll();

    if (result.isFailure()) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .send({ error: result.getError() });
    }

    return res
      .status(HttpStatus.OK)
      .send(
        result.getValue().map((budget) => this.serializeBudget(budget, user)),
      );
  }

  @Post()
  @ApiBody({ type: CreateBudgetRequestApiDto })
  async create(
    @Body() body: unknown,
    @User() user: JwtPayload,
    @Res() res: FastifyReply,
  ) {
    const result = await this.createBudgetUseCase.execute({
      ...(body as object),
      createdBy: user.name,
    });

    if (result.isFailure()) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .send({ error: result.getError() });
    }

    return res
      .status(HttpStatus.CREATED)
      .send(this.serializeBudget(result.getValue(), user));
  }

  @Post(":id/copy")
  async copy(
    @Param("id") id: string,
    @User() user: JwtPayload,
    @Res() res: FastifyReply,
  ) {
    const result = await this.copyBudgetUseCase.execute({
      id,
      createdBy: user.name,
    });

    if (result.isFailure()) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .send({ error: result.getError() });
    }

    return res
      .status(HttpStatus.CREATED)
      .send(this.serializeBudget(result.getValue(), user));
  }

  @Put(":id")
  @ApiBody({ type: UpdateBudgetRequestApiDto })
  async update(
    @Param("id") id: string,
    @Body() body: unknown,
    @User() user: JwtPayload,
    @Res() res: FastifyReply,
  ) {
    const result = await this.updateBudgetUseCase.execute({
      ...(body as object),
      id,
      updatedBy: user.name,
    });

    if (result.isFailure()) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .send({ error: result.getError() });
    }

    return res
      .status(HttpStatus.OK)
      .send(this.serializeBudget(result.getValue(), user));
  }

  @Patch(":id/approve")
  async approve(
    @Param("id") id: string,
    @User() user: JwtPayload,
    @Res() res: FastifyReply,
  ) {
    const result = await this.approveBudgetUseCase.execute({
      id,
      updatedBy: user.name,
    });

    if (result.isFailure()) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .send({ error: result.getError() });
    }

    return res
      .status(HttpStatus.OK)
      .send(
        result.getValue().map((budget) => this.serializeBudget(budget, user)),
      );
  }

  @Delete(":id")
  async delete(@Param("id") id: string, @Res() res: FastifyReply) {
    const result = await this.deleteBudgetUseCase.execute({ id });

    if (result.isFailure()) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .send({ error: result.getError() });
    }

    return res.status(HttpStatus.NO_CONTENT).send();
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
  async getDetails(
    @Param("id") id: string,
    @User() user: JwtPayload,
    @Res() res: FastifyReply,
  ) {
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

    return res.status(HttpStatus.OK).send(this.serializeBudget(budget, user));
  }

  @Get(":id")
  async get(
    @Param("id") id: string,
    @User() user: JwtPayload,
    @Res() res: FastifyReply,
  ) {
    const result = await this.budgetRepository.getByIdForRead(id);

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

    return res.status(HttpStatus.OK).send(this.serializeBudget(budget, user));
  }

  private serializeBudget<
    T extends { createdBy?: string; updatedBy?: string | null },
  >(budget: T, user: JwtPayload): T | Omit<T, "createdBy" | "updatedBy"> {
    if (user.role === Role.ADMIN) return budget;

    return { ...budget, createdBy: undefined, updatedBy: undefined };
  }
}
