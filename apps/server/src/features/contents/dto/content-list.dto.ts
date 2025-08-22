import { Type, Transform } from "class-transformer";
import { IsArray, IsInt, IsOptional, Min } from "class-validator";

export class ListWithPublicQuery {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  authorId!: number;

  @IsOptional()
  @Transform(({ value }) => {
    if (Array.isArray(value)) {
      return value.map(Number).filter((v) => Number.isFinite(v));
    }
    if (typeof value === "string") {
      return value
        .split(",")
        .map((v) => Number(v.trim()))
        .filter((v) => Number.isFinite(v));
    }
    return [];
  })
  @IsArray()
  tagIds: number[] = [];

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  pageSize: number = 20;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  total: number = 0;
}
