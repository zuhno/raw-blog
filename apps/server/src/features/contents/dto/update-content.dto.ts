import { IsArray, IsBoolean, IsOptional, IsString, MinLength } from "class-validator";

export class UpdateContentDto {
  @IsString()
  @MinLength(1)
  @IsOptional()
  title?: string;

  @IsString()
  @MinLength(1)
  @IsOptional()
  body?: string;

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
