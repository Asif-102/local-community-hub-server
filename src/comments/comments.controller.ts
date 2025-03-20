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
import { CommentsService } from "./comments.service";
import { CreateCommentDto } from "./dtos/create-comment.dto";

@UseGuards(RolesGuard)
@UseGuards(JwtAccessGuard)
@Controller("comments")
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Roles(Role.USER, Role.ADMIN, Role.SUPER_ADMIN)
  @Get(":postId")
  @HttpCode(HttpStatus.OK)
  getComments(@Param("postId", ParseIntPipe) postId: number) {
    return this.commentsService.getComments(postId);
  }

  @Roles(Role.USER, Role.ADMIN, Role.SUPER_ADMIN)
  @Post(":postId")
  @HttpCode(HttpStatus.CREATED)
  createComment(
    @Param("postId", ParseIntPipe) postId: number,
    @Body() dto: CreateCommentDto,
    @CurrentUser("id", ParseIntPipe) authorId: number,
  ) {
    return this.commentsService.createComment(postId, authorId, dto);
  }

  @Roles(Role.USER, Role.ADMIN, Role.SUPER_ADMIN)
  @Patch(":postId/:commentId")
  @HttpCode(HttpStatus.OK)
  updateComment(
    @Param("postId", ParseIntPipe) postId: number,
    @Param("commentId", ParseIntPipe) commentId: number,
    @Body() dto: CreateCommentDto,
    @CurrentUser("id", ParseIntPipe) authorId: number,
  ) {
    return this.commentsService.updateComment(postId, commentId, authorId, dto);
  }

  @Roles(Role.USER, Role.ADMIN, Role.SUPER_ADMIN)
  @Delete(":postId/:commentId")
  @HttpCode(HttpStatus.OK)
  deleteComment(
    @Param("postId", ParseIntPipe) postId: number,
    @Param("commentId", ParseIntPipe) commentId: number,
    @CurrentUser("id", ParseIntPipe) authorId: number,
  ) {
    return this.commentsService.deleteComment(postId, commentId, authorId);
  }
}
