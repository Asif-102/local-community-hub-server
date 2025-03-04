import { BadRequestException, ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateUserDto } from "./dtos/create-user.dto";
import { GetUserDto } from "./dtos/get-user.dto";

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async createOne({ email, firstName, lastName, avatar, hashedPassword }: CreateUserDto) {
    const userByEmail = await this.prismaService.user.findUnique({ where: { email } });

    if (userByEmail) {
      throw new ConflictException("User with this email is already existing");
    }

    const userCount = await this.prismaService.user.count();
    const role = userCount === 0 ? "SUPER_ADMIN" : "USER";

    const createUser = await this.prismaService.user.create({
      data: {
        email,
        firstName,
        lastName,
        avatar,
        hashedPassword,
        role,
      },
    });

    return createUser;
  }

  async getOne({ id, email }: GetUserDto) {
    if (!id && !email) {
      throw new BadRequestException();
    }

    const user = await this.prismaService.user.findFirst({
      where: { id, email },
    });

    return user;
  }

  async getUserById(id: number) {
    const user = await this.prismaService.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException("User with this id is not found");
    }
    return user;
  }
}
