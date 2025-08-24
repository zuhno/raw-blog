import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from "class-validator";

export class CreateCommentDto {
  @IsInt()
  @IsNotEmpty()
  contentId!: number;

  @IsOptional()
  @IsInt()
  parentId?: number;

  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  text!: string;
}
