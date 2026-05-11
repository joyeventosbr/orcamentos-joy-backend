export class Event {
  constructor(
    public id: string,
    public companyId: string,
    public name: string,
    public createdAt: Date,
    public updatedAt?: Date,
  ) {}
}
