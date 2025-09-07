import { Type, Transform } from "class-transformer";
import { IsArray, IsEnum, IsInt, IsOptional, Min } from "class-validator";
import { EContentType } from "src/shared/utils/type";

export enum ESortType {
  DESC,
  ASC,
}

export class ListQuery {
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

  @Type(() => String)
  @IsEnum(EContentType)
  type!: EContentType;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  offset: number;

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
