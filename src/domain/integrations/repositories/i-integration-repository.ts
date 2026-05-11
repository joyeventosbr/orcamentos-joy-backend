import { Result } from "@shared/result";
import { Integration } from "../entities/integration.entity";
import { PaginationRequestDto } from "@domain/shared/dtos/paginations/pagination-request.dto";
import { PaginationResponseDto } from "@domain/shared/dtos/paginations/pagination-response.dto";

export interface IIntegrationRepository {
  create(data: Integration): Promise<Result<Integration>>;
  update(data: Integration): Promise<Result<Integration>>;
  getById(id: string): Promise<Result<Integration | null>>;
  getAllPaginated(
    params: PaginationRequestDto,
  ): Promise<Result<PaginationResponseDto<Integration>>>;
}
