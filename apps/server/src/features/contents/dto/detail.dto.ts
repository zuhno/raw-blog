import { Type } from "class-transformer";
import { IsInt, Min } from "class-validator";

export class DetailWithPublicParam {
  @Type(() => Number)
  @IsInt()
  @Min(0)
  id!: number;
}
