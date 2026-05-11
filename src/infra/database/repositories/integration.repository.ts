import { Injectable } from "@nestjs/common";
import { Result } from "@shared/result";
import { Integration } from "@domain/integrations/entities/integration.entity";
import { IIntegrationRepository } from "@domain/integrations/repositories/i-integration-repository";
import { Repository } from "typeorm";
import { IntegrationSchema } from "@infra/database/typeorm/schemas/integration.schema";
import { InjectRepository } from "@nestjs/typeorm";
import { IntegrationMapper } from "../mappers/integration.mapper";
import { PaginationRequestDto } from "@domain/shared/dtos/paginations/pagination-request.dto";
import { PaginationResponseDto } from "@domain/shared/dtos/paginations/pagination-response.dto";

@Injectable()
export class IntegrationRepository implements IIntegrationRepository {
  constructor(
    @InjectRepository(IntegrationSchema)
    private readonly integrationSchema: Repository<IntegrationSchema>,
  ) {}

  async create(data: Integration): Promise<Result<Integration>> {
    try {
      const integration = this.integrationSchema.create(
        IntegrationMapper.toSchema(data),
      );

      const dataWithoutId = { ...integration, id: undefined };

      const savedIntegration = await this.integrationSchema.save(dataWithoutId);

      const resultIntegration = IntegrationMapper.toEntity(savedIntegration);

      return await Promise.resolve(Result.success(resultIntegration));
    } catch (error) {
      return Result.failure(
        "Falha ao cadastrar integração, erro: " + error?.message,
      );
    }
  }

  async update(data: Integration): Promise<Result<Integration>> {
    try {
      const schema = IntegrationMapper.toSchema(data);

      const dataWithoutId = { ...schema, id: undefined };

      await this.integrationSchema.update(schema.id, dataWithoutId);

      return Result.success(data);
    } catch (error) {
      return Result.failure(
        "Falha ao atualizar integração, erro: " + error?.message,
      );
    }
  }

  async getById(id: string): Promise<Result<Integration | null>> {
    try {
      const integration = await this.integrationSchema.findOne({
        where: { id },
      });

      if (!integration) {
        return Result.success(null);
      }

      const entity = IntegrationMapper.toEntity(integration);

      return Result.success(entity);
    } catch (error) {
      return Result.failure(
        "Falha ao buscar integração por ID, erro: " + error?.message,
      );
    }
  }

  async getAllPaginated(
    params: PaginationRequestDto,
  ): Promise<Result<PaginationResponseDto<Integration>>> {
    try {
      const limit = params.limit ?? 10;

      let offset = 0;
      let page = 1;

      if (params.page && params.page > 0) {
        page = params.page;
        offset = (params.page - 1) * limit;
      } else if (params.offset !== undefined) {
        offset = params.offset;
        page = Math.floor(offset / limit) + 1;
      } else {
        page = params.page && params.page > 0 ? params.page : 1;
        offset = (page - 1) * limit;
      }

      const orderBy = params.orderBy ?? "createdAt";
      const orderDirection = params.orderDirection ?? "DESC";

      const [integrations, total] = await this.integrationSchema.findAndCount({
        skip: offset,
        take: limit,
        order: {
          [orderBy]: orderDirection,
        },
      });

      const entities = IntegrationMapper.toEntityList(integrations);

      const response = new PaginationResponseDto<Integration>({
        data: entities,
        total,
        limit,
        page,
        offset,
      });

      return Result.success(response);
    } catch (error) {
      return Result.failure(
        "Falha ao buscar dados paginados, erro: " + error?.message,
      );
    }
  }
}
