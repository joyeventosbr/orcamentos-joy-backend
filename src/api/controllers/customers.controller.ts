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
import { User } from "@infra/auth/jwt/decorators/user.decorator";
import type { JwtPayload } from "@infra/auth/jwt/jwt.type";
import { Role } from "@domain/users/enums/user-role.enum";
import { TemporaryAccessService } from "@infra/auth/jwt/temporary-access.service";
import { Admin } from "@infra/auth/jwt/decorators/admin.decorator";

@ApiTags("customers")
@Controller("customers")
export class CustomersController {
  constructor(
    private readonly access: TemporaryAccessService,
    private readonly createCustomerUseCase: CreateCustomerUseCase,
    private readonly updateCustomerUseCase: UpdateCustomerUseCase,
    private readonly deleteCustomerUseCase: DeleteCustomerUseCase,
    @Inject("ICustomerRepository")
    private readonly customerRepository: ICustomerRepository,
  ) {}

  @Get()
  async getAll(@User() user: JwtPayload, @Res() res: FastifyReply) {
    const result = await this.customerRepository.getAll();
    if (result.isFailure()) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .send({ error: result.getError() });
    }

    const items = result.getValue();
    const allowed =
      user.role === Role.TEMPORARY
        ? await this.access.customers(user.folderIds ?? [])
        : null;
    return res
      .status(HttpStatus.OK)
      .send(
        allowed ? items.filter((item) => allowed.includes(item.id)) : items,
      );
  }

  @Post()
  @ApiBody({ type: CreateCustomerRequestApiDto })
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
  @Admin()
  async delete(@Param("id") id: string, @Res() res: FastifyReply) {
    const result = await this.deleteCustomerUseCase.execute({ id });
    if (result.isFailure()) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .send({ error: result.getError() });
    }

    return res.status(HttpStatus.NO_CONTENT).send();
  }
}
