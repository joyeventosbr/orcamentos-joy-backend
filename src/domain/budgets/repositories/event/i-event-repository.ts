import { Event } from "@domain/budgets/entities/event.entity";
import { Result } from "@shared/result";

export interface IEventRepository {
  create(data: Event): Promise<Result<Event>>;
  update(data: Event): Promise<Result<Event>>;
  delete(id: string): Promise<Result<void>>;
  getById(id: string): Promise<Result<Event | null>>;
}
