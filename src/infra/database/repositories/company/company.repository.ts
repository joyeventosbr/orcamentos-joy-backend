import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Company } from "@domain/budgets/entities/company.entity";
import type { ICompanyRepository } from "@domain/budgets/repositories/company/i-company-repository";
import { Result } from "@shared/result";
import { Repository } from "typeorm";
import { CompanySchema } from "@infra/database/typeorm/schemas/company.schema";

@Injectable()
export class CompanyRepository implements ICompanyRepository {
  constructor(
    @InjectRepository(CompanySchema)
    private readonly companySchemaRepository: Repository<CompanySchema>,
  ) {}

  async create(data: Company): Promise<Result<Company>> {
    try {
      const saved = await this.companySchemaRepository.save({
        name: data.name,
        createdAt: new Date(),
      });

      return Result.success(
        new Company(saved.id, saved.name, saved.createdAt, saved.updatedAt),
      );
    } catch (error) {
      return Result.failure("Falha ao criar empresa, erro: " + error);
    }
  }

  async update(data: Company): Promise<Result<Company>> {
    try {
      const saved = await this.companySchemaRepository.save({
        id: data.id,
        name: data.name,
        createdAt: data.createdAt,
        updatedAt: new Date(),
      });

      return Result.success(
        new Company(saved.id, saved.name, saved.createdAt, saved.updatedAt),
      );
    } catch (error) {
      return Result.failure("Falha ao atualizar empresa, erro: " + error);
    }
  }

  async delete(id: string): Promise<Result<void>> {
    try {
      await this.companySchemaRepository.delete({ id });
      return Result.success();
    } catch (error) {
      return Result.failure("Falha ao remover empresa, erro: " + error);
    }
  }

  async getById(id: string): Promise<Result<Company | null>> {
    try {
      const company = await this.companySchemaRepository.findOne({
        where: { id },
      });
      if (!company) return Result.success(null);

      return Result.success(
        new Company(
          company.id,
          company.name,
          company.createdAt,
          company.updatedAt,
        ),
      );
    } catch (error) {
      return Result.failure("Falha ao buscar empresa, erro: " + error);
    }
  }
}
