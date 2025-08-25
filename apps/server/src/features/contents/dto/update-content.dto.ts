import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
} from "class-validator";

import { EContentType } from "../../../shared/utils/type";

export class UpdateContentDto {
  @IsString()
  @MinLength(1)
  @IsOptional()
  title?: string;

  @IsString()
  @MinLength(1)
  @IsOptional()
  body?: string;

  @IsEnum(EContentType)
  @IsOptional()
  type?: EContentType;

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
