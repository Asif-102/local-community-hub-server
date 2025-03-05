import { Transform } from "class-transformer";
import { IsDefined, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreatePostDto {
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  content: string;

  @IsDefined()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  categoryId: number;

  hashTag?: string;
}
