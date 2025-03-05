import { Module } from "@nestjs/common";
import { CategoryService } from "src/category/category.service";
import { CloudinaryService } from "src/cloudinary.service";
import { HashtagsService } from "src/hashtags/hashtags.service";
import { PostsController } from "./posts.controller";
import { PostsService } from "./posts.service";

@Module({
  imports: [],
  controllers: [PostsController],
  providers: [PostsService, CloudinaryService, HashtagsService, CategoryService],
})
export class PostsModule {}
