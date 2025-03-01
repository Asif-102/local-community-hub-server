export class CreateUserDto {
  email: string;

  firstName: string;

  lastName: string;

  avatar?: string;

  hashedPassword?: string;
}
