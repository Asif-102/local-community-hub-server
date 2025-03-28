import { IsDefined, IsNotEmpty, IsString } from "class-validator";

export class CreateCommentDto {
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  content: string;
}
