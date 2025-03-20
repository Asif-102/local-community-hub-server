import { Controller, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Patch, UseGuards } from "@nestjs/common";
import { Roles } from "src/auth/decorators/roles.decorator";
import { Role } from "src/auth/enums/role.enum";
import { JwtAccessGuard } from "src/auth/guards/jwt-access.guard";
import { RolesGuard } from "src/auth/guards/roles/roles.guard";
import { CurrentUser } from "src/utils/decorators/current-user.decorator";
import { LikesService } from "./likes.service";

@UseGuards(RolesGuard)
@UseGuards(JwtAccessGuard)
@Controller("likes")
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @Roles(Role.USER, Role.ADMIN, Role.SUPER_ADMIN)
  @Get(":postId")
  @HttpCode(HttpStatus.OK)
  getLikes(@Param("postId", ParseIntPipe) postId: number) {
    return this.likesService.getLikes(postId);
  }

  @Roles(Role.USER, Role.ADMIN, Role.SUPER_ADMIN)
  @Patch(":postId")
  @HttpCode(HttpStatus.OK)
  toggleLike(@Param("postId", ParseIntPipe) postId: number, @CurrentUser("id", ParseIntPipe) authorId: number) {
    return this.likesService.toggleLike(postId, authorId);
  }
}
