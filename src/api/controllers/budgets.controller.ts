import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Res } from "@nestjs/common";
import { type FastifyReply } from "fastify";
import { ApiBody, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { CreateBudgetUseCase } from "@application/budgets/usecases/budget/create/create-budget.usecase";
import { UpdateBudgetUseCase } from "@application/budgets/usecases/budget/update/update-budget.usecase";
import { DeleteBudgetUseCase } from "@application/budgets/usecases/budget/delete/delete-budget.usecase";
import { ExportBudgetUseCase } from "@application/budgets/usecases/budget/export/export-budget.usecase";
import { CreateEventUseCase } from "@application/budgets/usecases/event/create/create-event.usecase";
import { UpdateEventUseCase } from "@application/budgets/usecases/event/update/update-event.usecase";
import { DeleteEventUseCase } from "@application/budgets/usecases/event/delete/delete-event.usecase";
import { CreateCategoryUseCase } from "@application/budgets/usecases/category/create/create-category.usecase";
import { UpdateCategoryUseCase } from "@application/budgets/usecases/category/update/update-category.usecase";
import { DeleteCategoryUseCase } from "@application/budgets/usecases/category/delete/delete-category.usecase";
import { CreateCompanyUseCase } from "@application/budgets/usecases/company/create/create-company.usecase";
import { UpdateCompanyUseCase } from "@application/budgets/usecases/company/update/update-company.usecase";
import { DeleteCompanyUseCase } from "@application/budgets/usecases/company/delete/delete-company.usecase";
import { CreateBudgetRequestApiDto } from "@api/dtos/budgets/requests/create-budget-request.api.dto";
import { UpdateBudgetRequestApiDto } from "@api/dtos/budgets/requests/update-budget-request.api.dto";
import { ExportBudgetResponseApiDto } from "@api/dtos/budgets/responses/export-budget-response.api.dto";
import { CreateEventRequestApiDto } from "@api/dtos/budgets/requests/events/create-event-request.api.dto";
import { UpdateEventRequestApiDto } from "@api/dtos/budgets/requests/events/update-event-request.api.dto";
import { CreateCategoryRequestApiDto } from "@api/dtos/budgets/requests/categories/create-category-request.api.dto";
import { UpdateCategoryRequestApiDto } from "@api/dtos/budgets/requests/categories/update-category-request.api.dto";
import { CreateCompanyRequestApiDto } from "@api/dtos/budgets/requests/companies/create-company-request.api.dto";
import { UpdateCompanyRequestApiDto } from "@api/dtos/budgets/requests/companies/update-company-request.api.dto";

@ApiTags("budgets")
@Controller("budgets")
export class BudgetsController {
  constructor(
    private readonly createBudgetUseCase: CreateBudgetUseCase,
    private readonly updateBudgetUseCase: UpdateBudgetUseCase,
    private readonly deleteBudgetUseCase: DeleteBudgetUseCase,
    private readonly exportBudgetUseCase: ExportBudgetUseCase,
    private readonly createEventUseCase: CreateEventUseCase,
    private readonly updateEventUseCase: UpdateEventUseCase,
    private readonly deleteEventUseCase: DeleteEventUseCase,
    private readonly createCategoryUseCase: CreateCategoryUseCase,
    private readonly updateCategoryUseCase: UpdateCategoryUseCase,
    private readonly deleteCategoryUseCase: DeleteCategoryUseCase,
    private readonly createCompanyUseCase: CreateCompanyUseCase,
    private readonly updateCompanyUseCase: UpdateCompanyUseCase,
    private readonly deleteCompanyUseCase: DeleteCompanyUseCase,
  ) {}

  @Post()
  @ApiBody({ type: CreateBudgetRequestApiDto })
  async create(@Body() body: unknown, @Res() res: FastifyReply) {
    const result = await this.createBudgetUseCase.execute(body);

    if (result.isFailure()) {
      return res.status(HttpStatus.BAD_REQUEST).send({ error: result.getError() });
    }

    return res.status(HttpStatus.CREATED).send(result.getValue());
  }

  @Put(":id")
  @ApiBody({ type: UpdateBudgetRequestApiDto })
  async update(@Param("id") id: string, @Body() body: unknown, @Res() res: FastifyReply) {
    const result = await this.updateBudgetUseCase.execute({ ...(body as object), id });

    if (result.isFailure()) {
      return res.status(HttpStatus.BAD_REQUEST).send({ error: result.getError() });
    }

    return res.status(HttpStatus.OK).send(result.getValue());
  }

  @Delete(":id")
  async delete(@Param("id") id: string, @Res() res: FastifyReply) {
    const result = await this.deleteBudgetUseCase.execute({ id });

    if (result.isFailure()) {
      return res.status(HttpStatus.BAD_REQUEST).send({ error: result.getError() });
    }

    return res.status(HttpStatus.OK).send({ success: true });
  }

  @Get(":id/export")
  @ApiOkResponse({ type: ExportBudgetResponseApiDto })
  async export(@Param("id") id: string, @Res() res: FastifyReply) {
    const result = await this.exportBudgetUseCase.execute({ id });

    if (result.isFailure()) {
      return res.status(HttpStatus.BAD_REQUEST).send({ error: result.getError() });
    }

    return res.status(HttpStatus.OK).send(result.getValue());
  }

  @Post("/events")
  @ApiBody({ type: CreateEventRequestApiDto })
  async createEvent(@Body() body: unknown, @Res() res: FastifyReply) {
    const result = await this.createEventUseCase.execute(body);
    if (result.isFailure()) {
      return res.status(HttpStatus.BAD_REQUEST).send({ error: result.getError() });
    }
    return res.status(HttpStatus.CREATED).send(result.getValue());
  }

  @Put("/events/:id")
  @ApiBody({ type: UpdateEventRequestApiDto })
  async updateEvent(@Param("id") id: string, @Body() body: unknown, @Res() res: FastifyReply) {
    const result = await this.updateEventUseCase.execute({ ...(body as object), id });
    if (result.isFailure()) {
      return res.status(HttpStatus.BAD_REQUEST).send({ error: result.getError() });
    }
    return res.status(HttpStatus.OK).send(result.getValue());
  }

  @Delete("/events/:id")
  async deleteEvent(@Param("id") id: string, @Res() res: FastifyReply) {
    const result = await this.deleteEventUseCase.execute({ id });
    if (result.isFailure()) {
      return res.status(HttpStatus.BAD_REQUEST).send({ error: result.getError() });
    }
    return res.status(HttpStatus.OK).send({ success: true });
  }

  @Post("/categories")
  @ApiBody({ type: CreateCategoryRequestApiDto })
  async createCategory(@Body() body: unknown, @Res() res: FastifyReply) {
    const result = await this.createCategoryUseCase.execute(body);
    if (result.isFailure()) {
      return res.status(HttpStatus.BAD_REQUEST).send({ error: result.getError() });
    }
    return res.status(HttpStatus.CREATED).send(result.getValue());
  }

  @Put("/categories/:id")
  @ApiBody({ type: UpdateCategoryRequestApiDto })
  async updateCategory(@Param("id") id: string, @Body() body: unknown, @Res() res: FastifyReply) {
    const result = await this.updateCategoryUseCase.execute({ ...(body as object), id });
    if (result.isFailure()) {
      return res.status(HttpStatus.BAD_REQUEST).send({ error: result.getError() });
    }
    return res.status(HttpStatus.OK).send(result.getValue());
  }

  @Delete("/categories/:id")
  async deleteCategory(@Param("id") id: string, @Res() res: FastifyReply) {
    const result = await this.deleteCategoryUseCase.execute({ id });
    if (result.isFailure()) {
      return res.status(HttpStatus.BAD_REQUEST).send({ error: result.getError() });
    }
    return res.status(HttpStatus.OK).send({ success: true });
  }

  @Post("/companies")
  @ApiBody({ type: CreateCompanyRequestApiDto })
  async createCompany(@Body() body: unknown, @Res() res: FastifyReply) {
    const result = await this.createCompanyUseCase.execute(body);
    if (result.isFailure()) {
      return res.status(HttpStatus.BAD_REQUEST).send({ error: result.getError() });
    }
    return res.status(HttpStatus.CREATED).send(result.getValue());
  }

  @Put("/companies/:id")
  @ApiBody({ type: UpdateCompanyRequestApiDto })
  async updateCompany(@Param("id") id: string, @Body() body: unknown, @Res() res: FastifyReply) {
    const result = await this.updateCompanyUseCase.execute({ ...(body as object), id });
    if (result.isFailure()) {
      return res.status(HttpStatus.BAD_REQUEST).send({ error: result.getError() });
    }
    return res.status(HttpStatus.OK).send(result.getValue());
  }

  @Delete("/companies/:id")
  async deleteCompany(@Param("id") id: string, @Res() res: FastifyReply) {
    const result = await this.deleteCompanyUseCase.execute({ id });
    if (result.isFailure()) {
      return res.status(HttpStatus.BAD_REQUEST).send({ error: result.getError() });
    }
    return res.status(HttpStatus.OK).send({ success: true });
  }
}
