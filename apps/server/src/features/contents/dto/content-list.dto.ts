import { Type, Transform } from "class-transformer";
import { IsArray, IsEnum, IsInt, IsOptional, Min } from "class-validator";

export enum ESortType {
  DESC,
  ASC,
}

export class ListQuery {
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
  offset: number = 0;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit: number = 20;

  @IsOptional()
  @Type(() => Number)
  @IsEnum(ESortType)
  sort: ESortType = ESortType.DESC;
}
