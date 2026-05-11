export class PaginationRequestDto {
  page?: number;
  limit?: number;
  offset?: number;
  orderBy?: string;
  orderDirection?: "ASC" | "DESC";
}
