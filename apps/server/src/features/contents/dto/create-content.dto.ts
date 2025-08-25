import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from "class-validator";

import { EContentType } from "../../../shared/utils/type";

export class CreateContentDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  title!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  body!: string;

  @IsEnum(EContentType)
  @IsNotEmpty()
  type!: EContentType;

  @IsBoolean()
  @IsOptional()
  publish?: boolean;

  @IsBoolean()
  @IsOptional()
  private?: boolean;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];
}
