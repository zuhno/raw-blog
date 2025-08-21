import { IsArray, IsBoolean, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";

export class CreateContentDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  title!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  body!: string;

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
