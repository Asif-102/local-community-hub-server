import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { Roles } from "src/auth/decorators/roles.decorator";
import { Role } from "src/auth/enums/role.enum";
import { JwtAccessGuard } from "src/auth/guards/jwt-access.guard";
import { RolesGuard } from "src/auth/guards/roles/roles.guard";
import { CurrentUser } from "src/utils/decorators/current-user.decorator";
import { CategoryService } from "./category.service";
import { CreateCategoryDto } from "./dtos/create-category.dto";

@UseGuards(RolesGuard)
@UseGuards(JwtAccessGuard)
@Controller("category")
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Roles(Role.USER, Role.ADMIN, Role.SUPER_ADMIN)
  @Get()
  @HttpCode(HttpStatus.OK)
  getAll() {
    return this.categoryService.getAll();
  }

  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateCategoryDto, @CurrentUser("id", ParseIntPipe) userId: number) {
    return this.categoryService.create(dto, userId);
  }

  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @Patch(":id")
  @HttpCode(HttpStatus.OK)
  update(@Param("id", ParseIntPipe) id: number, @Body() dto: CreateCategoryDto) {
    return this.categoryService.update(id, dto);
  }

  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @Patch(":id/status")
  @HttpCode(HttpStatus.OK)
  changeStatus(@Param("id", ParseIntPipe) id: number) {
    return this.categoryService.changeStatus(id);
  }

  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @Delete(":id")
  @HttpCode(HttpStatus.OK)
  delete(@Param("id", ParseIntPipe) id: number) {
    return this.categoryService.delete(id);
  }
}
