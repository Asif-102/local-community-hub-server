import { IsDefined, IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class RegisterDto {
  @IsDefined()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  avatar?: string;

  @IsDefined()
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;
}
