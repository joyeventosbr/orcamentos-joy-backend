import { Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Event } from "@domain/budgets/entities/event.entity";
import { CompanyEvent } from "@domain/budgets/entities/company-event.entity";
import type { IEventRepository } from "@domain/budgets/repositories/event/i-event-repository";
import type { IBudgetRelationRepository } from "@domain/budgets/repositories/relation/i-budget-relation-repository";
import { Result } from "@shared/result";
import { Repository } from "typeorm";
import { EventSchema } from "@infra/database/typeorm/schemas/event.schema";

@Injectable()
export class EventRepository implements IEventRepository {
  constructor(
    @InjectRepository(EventSchema)
    private readonly eventSchemaRepository: Repository<EventSchema>,
    @Inject("IBudgetRelationRepository")
    private readonly budgetRelationRepository: IBudgetRelationRepository,
  ) {}

  async create(data: Event): Promise<Result<Event>> {
    try {
      const saved = await this.eventSchemaRepository.save({
        name: data.name,
        createdAt: new Date(),
      });
      const relationResult =
        await this.budgetRelationRepository.createCompanyEvent(
          new CompanyEvent(data.companyId, saved.id),
        );
      if (relationResult.isFailure()) {
        return Result.failure(relationResult.getError());
      }

      return Result.success(
        new Event(
          saved.id,
          data.companyId,
          saved.name,
          saved.createdAt,
          saved.updatedAt,
        ),
      );
    } catch (error) {
      return Result.failure("Falha ao criar evento, erro: " + error);
    }
  }

  async update(data: Event): Promise<Result<Event>> {
    try {
      await this.eventSchemaRepository.save({
        id: data.id,
        name: data.name,
        createdAt: data.createdAt,
        updatedAt: new Date(),
      });

      const relationResult =
        await this.budgetRelationRepository.replaceCompanyEvent(
          new CompanyEvent(data.companyId, data.id),
        );
      if (relationResult.isFailure()) {
        return Result.failure(relationResult.getError());
      }

      return Result.success(data);
    } catch (error) {
      return Result.failure("Falha ao atualizar evento, erro: " + error);
    }
  }

  async delete(id: string): Promise<Result<void>> {
    try {
      await this.eventSchemaRepository.delete({ id });
      return Result.success();
    } catch (error) {
      return Result.failure("Falha ao remover evento, erro: " + error);
    }
  }

  async getById(id: string): Promise<Result<Event | null>> {
    try {
      const event = await this.eventSchemaRepository.findOne({ where: { id } });
      if (!event) return Result.success(null);

      const companyIdResult =
        await this.budgetRelationRepository.getCompanyIdByEventId(id);
      if (companyIdResult.isFailure()) {
        return Result.failure(companyIdResult.getError());
      }

      return Result.success(
        new Event(
          event.id,
          companyIdResult.getValue() ?? "",
          event.name,
          event.createdAt,
          event.updatedAt,
        ),
      );
    } catch (error) {
      return Result.failure("Falha ao buscar evento, erro: " + error);
    }
  }
}
