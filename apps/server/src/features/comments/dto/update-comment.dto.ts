import { IsOptional, IsString, MinLength } from "class-validator";

export class UpdateCommentDto {
  @IsString()
  @MinLength(1)
  @IsOptional()
  text?: string;
}
