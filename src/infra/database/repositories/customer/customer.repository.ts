import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Customer } from "@domain/budgets/entities/customer.entity";
import type { ICustomerRepository } from "@domain/budgets/repositories/customer/i-customer-repository";
import { Result } from "@shared/result";
import { Repository } from "typeorm";
import { CustomerSchema } from "@infra/database/typeorm/schemas/customer.schema";

@Injectable()
export class CustomerRepository implements ICustomerRepository {
  constructor(
    @InjectRepository(CustomerSchema)
    private readonly customerSchemaRepository: Repository<CustomerSchema>,
  ) {}

  async create(data: Customer): Promise<Result<Customer>> {
    try {
      const saved = await this.customerSchemaRepository.save({
        name: data.name,
        createdAt: new Date(),
      });

      return Result.success(
        Customer.read({
          id: saved.id,
          name: saved.name,
          createdAt: saved.createdAt,
          updatedAt: saved.updatedAt,
        }),
      );
    } catch (error) {
      return Result.failure("Falha ao criar cliente, erro: " + error);
    }
  }

  async update(data: Customer): Promise<Result<Customer>> {
    try {
      const saved = await this.customerSchemaRepository.save({
        id: data.id,
        name: data.name,
        createdAt: data.createdAt,
        updatedAt: new Date(),
      });

      return Result.success(
        Customer.read({
          id: saved.id,
          name: saved.name,
          createdAt: saved.createdAt,
          updatedAt: saved.updatedAt,
        }),
      );
    } catch (error) {
      return Result.failure("Falha ao atualizar cliente, erro: " + error);
    }
  }

  async delete(id: string): Promise<Result<void>> {
    try {
      await this.customerSchemaRepository.delete({ id });
      return Result.success();
    } catch (error) {
      return Result.failure("Falha ao remover cliente, erro: " + error);
    }
  }

  async getById(id: string): Promise<Result<Customer | null>> {
    try {
      const customer = await this.customerSchemaRepository.findOne({
        where: { id },
      });
      if (!customer) return Result.success(null);

      return Result.success(
        Customer.read({
          id: customer.id,
          name: customer.name,
          createdAt: customer.createdAt,
          updatedAt: customer.updatedAt,
        }),
      );
    } catch (error) {
      return Result.failure("Falha ao buscar cliente, erro: " + error);
    }
  }

  async getAll(): Promise<Result<Customer[]>> {
    try {
      const customers = await this.customerSchemaRepository.find({
        order: { createdAt: "DESC" },
      });

      return Result.success(
        customers.map((customer) =>
          Customer.read({
            id: customer.id,
            name: customer.name,
            createdAt: customer.createdAt,
            updatedAt: customer.updatedAt,
          }),
        ),
      );
    } catch (error) {
      return Result.failure("Falha ao listar clientes, erro: " + error);
    }
  }
}
