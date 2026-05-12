import { ApiProperty } from "@nestjs/swagger";
import { CreateBudgetRequestApiDto } from "./create-budget-request.api.dto";

export class UpdateBudgetRequestApiDto extends CreateBudgetRequestApiDto {
  @ApiProperty()
  id!: string;
}
