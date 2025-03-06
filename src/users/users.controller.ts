import { Controller, Get, HttpCode, HttpStatus, ParseIntPipe, UseGuards } from "@nestjs/common";
import { Roles } from "src/auth/decorators/roles.decorator";
import { Role } from "src/auth/enums/role.enum";
import { JwtAccessGuard } from "src/auth/guards/jwt-access.guard";
import { RolesGuard } from "src/auth/guards/roles/roles.guard";
import { CurrentUser } from "src/utils/decorators/current-user.decorator";
import { UsersService } from "./users.service";

@UseGuards(RolesGuard)
@UseGuards(JwtAccessGuard)
@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Roles(Role.USER, Role.ADMIN, Role.SUPER_ADMIN)
  @Get("me")
  @HttpCode(HttpStatus.OK)
  fetchMe(@CurrentUser("id", ParseIntPipe) id: number) {
    return this.usersService.fetchMe(id);
  }
}
