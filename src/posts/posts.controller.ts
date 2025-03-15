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
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { Roles } from "src/auth/decorators/roles.decorator";
import { Role } from "src/auth/enums/role.enum";
import { JwtAccessGuard } from "src/auth/guards/jwt-access.guard";
import { RolesGuard } from "src/auth/guards/roles/roles.guard";
import { CurrentUser } from "src/utils/decorators/current-user.decorator";
import { CreatePostDto } from "./dtos/create-post.dto";
import { PostsService } from "./posts.service";

@UseGuards(RolesGuard)
@UseGuards(JwtAccessGuard)
@Controller("posts")
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Roles(Role.USER, Role.ADMIN, Role.SUPER_ADMIN)
  @Post()
  @UseInterceptors(FileInterceptor("image"))
  @HttpCode(HttpStatus.CREATED)
  create(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: CreatePostDto,
    @CurrentUser("id", ParseIntPipe) authorId: number,
  ) {
    return this.postsService.create(dto, file, authorId);
  }

  @Roles(Role.USER, Role.ADMIN, Role.SUPER_ADMIN)
  @Get()
  @HttpCode(HttpStatus.OK)
  getAll(@Query("take") take: number = 1, @Query("skip") skip: number = 1, @Query("search") search?: string) {
    take = take > 20 ? 20 : take;
    skip = skip < 0 ? 0 : skip;
    console.log({ search });
    return this.postsService.getAll(take, skip, search);
  }

  @Roles(Role.USER, Role.ADMIN, Role.SUPER_ADMIN)
  @Patch(":postId")
  @UseInterceptors(FileInterceptor("image"))
  @HttpCode(HttpStatus.OK)
  update(
    @Param("postId", ParseIntPipe) postId: number,
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: CreatePostDto,
    @CurrentUser("id", ParseIntPipe) authorId: number,
  ) {
    return this.postsService.update(postId, dto, file, authorId);
  }

  @Roles(Role.USER, Role.ADMIN, Role.SUPER_ADMIN)
  @Delete(":postId")
  @HttpCode(HttpStatus.OK)
  delete(@Param("postId", ParseIntPipe) postId: number, @CurrentUser("id", ParseIntPipe) authorId: number) {
    return this.postsService.delete(postId, authorId);
  }
}
