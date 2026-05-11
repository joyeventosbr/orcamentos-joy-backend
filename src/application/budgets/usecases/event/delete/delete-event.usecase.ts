import { Inject, Injectable } from "@nestjs/common";
import type { IBudgetRepository } from "@domain/budgets/repositories/i-budget-repository";
import { Result } from "@shared/result";
import { deleteEventSchema } from "./delete-event.dto";
import { ZError } from "@utils/index";

@Injectable()
export class DeleteEventUseCase {
  constructor(
    @Inject("IBudgetRepository")
    private readonly budgetRepository: IBudgetRepository,
  ) {}

  async execute(input: unknown) {
    const parsed = deleteEventSchema.safeParse(input);
    if (!parsed.success) {
      const errors = ZError.create(parsed.error).errors;
      return Result.failure(errors[0] ?? "Dados inválidos");
    }

    return this.budgetRepository.deleteEvent(parsed.data.id);
  }
}
