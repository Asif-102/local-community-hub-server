import { IsDefined, IsEmail, IsNotEmpty, IsString } from "class-validator";

export class GoogleDto {
  @IsDefined()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  avatar?: string;
}
