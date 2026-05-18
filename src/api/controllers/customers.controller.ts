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
import { CreateCustomerUseCase } from "@application/budgets/usecases/customer/create/create-customer.usecase";
import { DeleteCustomerUseCase } from "@application/budgets/usecases/customer/delete/delete-customer.usecase";
import { UpdateCustomerUseCase } from "@application/budgets/usecases/customer/update/update-customer.usecase";
import type { ICustomerRepository } from "@domain/customers/repositories/i-customer-repository";
import { CreateCustomerRequestApiDto } from "@api/dtos/customers/requests/create-customer-request.api.dto";
import { UpdateCustomerRequestApiDto } from "@api/dtos/customers/requests/update-customer-request.api.dto";
import { Public } from "@infra/auth/jwt/decorators/public.decorator";

@ApiTags("customers")
@Controller("customers")
export class CustomersController {
  constructor(
    private readonly createCustomerUseCase: CreateCustomerUseCase,
    private readonly updateCustomerUseCase: UpdateCustomerUseCase,
    private readonly deleteCustomerUseCase: DeleteCustomerUseCase,
    @Inject("ICustomerRepository")
    private readonly customerRepository: ICustomerRepository,
  ) {}

  @Get()
  @Public()
  async getAll(@Res() res: FastifyReply) {
    const result = await this.customerRepository.getAll();
    if (result.isFailure()) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .send({ error: result.getError() });
    }

    return res.status(HttpStatus.OK).send(result.getValue());
  }

  @Post()
  @ApiBody({ type: CreateCustomerRequestApiDto })
  @Public()
  async create(@Body() body: unknown, @Res() res: FastifyReply) {
    const result = await this.createCustomerUseCase.execute(body);
    if (result.isFailure()) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .send({ error: result.getError() });
    }

    return res.status(HttpStatus.CREATED).send(result.getValue());
  }

  @Put(":id")
  @Public()
  @ApiBody({ type: UpdateCustomerRequestApiDto })
  async update(
    @Param("id") id: string,
    @Body() body: unknown,
    @Res() res: FastifyReply,
  ) {
    const result = await this.updateCustomerUseCase.execute({
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
    const result = await this.deleteCustomerUseCase.execute({ id });
    if (result.isFailure()) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .send({ error: result.getError() });
    }

    return res.status(HttpStatus.OK).send({ success: true });
  }
}
