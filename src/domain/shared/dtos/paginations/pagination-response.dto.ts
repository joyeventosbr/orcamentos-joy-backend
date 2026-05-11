export class PaginationResponseDto<T> {
  data: T[];
  total: number;

  limit: number;
  page: number;
  offset: number;

  totalPages: number;
  totalData: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;

  constructor(props: {
    data: T[];
    total: number;
    limit: number;
    page: number;
    offset: number;
  }) {
    this.data = props.data;
    this.total = props.total;

    this.limit = props.limit;
    this.page = props.page;
    this.offset = props.offset;

    this.totalData = props.data.length;
    this.totalPages = Math.ceil(props.total / props.limit);
    this.hasNextPage = props.offset + props.limit < props.total;
    this.hasPreviousPage = props.offset > 0;
  }
}
