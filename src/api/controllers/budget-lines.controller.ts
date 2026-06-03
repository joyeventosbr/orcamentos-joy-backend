import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Inject,
  Param,
  Put,
  Res,
} from "@nestjs/common";
import { ApiBody, ApiTags } from "@nestjs/swagger";
import { type FastifyReply } from "fastify";
import { BulkUpdateBudgetLinesUseCase } from "@application/budgets/usecases/budget-line/bulk-update/bulk-update-budget-lines.usecase";
import type { IBudgetLineRepository } from "@domain/budgets/repositories/i-budget-line-repository";
import { BulkUpdateBudgetLinesRequestApiDto } from "@api/dtos/budget-lines/requests/bulk-update/bulk-update-budget-lines-request.api.dto";
import { User } from "@infra/auth/jwt/decorators/user.decorator";
import type { JwtPayload } from "@infra/auth/jwt/jwt.type";

@ApiTags("budget-lines")
@Controller("budget-lines")
export class BudgetLinesController {
  constructor(
    private readonly bulkUpdateBudgetLinesUseCase: BulkUpdateBudgetLinesUseCase,
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

  @Put("bulk")
  @ApiBody({ type: BulkUpdateBudgetLinesRequestApiDto })
  async bulkUpdate(
    @Body() body: unknown,
    @User() user: JwtPayload,
    @Res() res: FastifyReply,
  ) {
    const result = await this.bulkUpdateBudgetLinesUseCase.execute({
      ...(body as object),
      updatedBy: user.name,
    });

    if (result.isFailure()) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .send({ error: result.getError() });
    }

    return res.status(HttpStatus.OK).send(result.getValue());
  }
}
