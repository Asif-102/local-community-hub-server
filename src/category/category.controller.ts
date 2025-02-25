import { Controller, Post, UseGuards } from "@nestjs/common";
import { Roles } from "src/auth/decorators/roles.decorator";
import { Role } from "src/auth/enums/role.enum";
import { JwtAccessGuard } from "src/auth/guards/jwt-access.guard";
import { RolesGuard } from "src/auth/guards/roles/roles.guard";
import { CategoryService } from "./category.service";

@UseGuards(RolesGuard)
@UseGuards(JwtAccessGuard)
@Controller("category")
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Roles(Role.USER)
  @Post("user")
  createByUser() {
    return true;
  }

  @Roles(Role.ADMIN)
  @Post("admin")
  createByAdmin() {
    return true;
  }
}
