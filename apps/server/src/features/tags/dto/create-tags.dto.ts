import { ArrayMinSize, IsArray, IsString } from "class-validator";

export class CreateTagsDto {
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  names!: string[];
}
