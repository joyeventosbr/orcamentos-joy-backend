export class BudgetSuccessResponseDto<T = unknown> {
  constructor(
    public message: string,
    public data: T,
  ) {}
}
