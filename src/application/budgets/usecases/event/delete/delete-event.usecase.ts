import { Inject, Injectable } from "@nestjs/common";
import type { IEventRepository } from "@domain/budgets/repositories/event/i-event-repository";
import { Result } from "@shared/result";
import { deleteEventSchema } from "./delete-event.dto";
import { ZError } from "@utils/index";

@Injectable()
export class DeleteEventUseCase {
  constructor(
    @Inject("IEventRepository")
    private readonly eventRepository: IEventRepository,
  ) {}

  async execute(input: unknown) {
    const parsed = deleteEventSchema.safeParse(input);
    if (!parsed.success) {
      const errors = ZError.create(parsed.error).errors;
      return Result.failure(errors[0] ?? "Dados inválidos");
    }

    return this.eventRepository.delete(parsed.data.id);
  }
}
