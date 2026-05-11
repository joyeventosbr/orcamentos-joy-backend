import { Inject, Injectable } from "@nestjs/common";
import type { IEventRepository } from "@domain/budgets/repositories/event/i-event-repository";
import { Event } from "@domain/budgets/entities/event.entity";
import { Result } from "@shared/result";
import { createEventSchema } from "./create-event.dto";
import { ZError } from "@utils/index";

@Injectable()
export class CreateEventUseCase {
  constructor(
    @Inject("IEventRepository")
    private readonly eventRepository: IEventRepository,
  ) {}

  async execute(input: unknown) {
    const parsed = createEventSchema.safeParse(input);
    if (!parsed.success) {
      const errors = ZError.create(parsed.error).errors;
      return Result.failure(errors[0] ?? "Dados inválidos");
    }

    const event = new Event("", parsed.data.companyId, parsed.data.name, new Date());
    return this.eventRepository.create(event);
  }
}
