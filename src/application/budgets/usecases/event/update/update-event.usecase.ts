import { Inject, Injectable } from "@nestjs/common";
import type { IBudgetRepository } from "@domain/budgets/repositories/i-budget-repository";
import { Result } from "@shared/result";
import { updateEventSchema } from "./update-event.dto";
import { ZError } from "@utils/index";

@Injectable()
export class UpdateEventUseCase {
  constructor(
    @Inject("IBudgetRepository")
    private readonly budgetRepository: IBudgetRepository,
  ) {}

  async execute(input: unknown) {
    const parsed = updateEventSchema.safeParse(input);
    if (!parsed.success) {
      const errors = ZError.create(parsed.error).errors;
      return Result.failure(errors[0] ?? "Dados inválidos");
    }

    const eventResult = await this.budgetRepository.getEventById(parsed.data.id);
    if (eventResult.isFailure()) return Result.failure(eventResult.getError());
    const event = eventResult.getValue();
    if (!event) return Result.failure("Evento não encontrado");

    event.name = parsed.data.name;
    event.updatedAt = new Date();

    return this.budgetRepository.updateEvent(event);
  }
}
