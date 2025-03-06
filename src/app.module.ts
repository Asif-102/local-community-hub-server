import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { MulterModule } from "@nestjs/platform-express";
import { PrismaModule } from "prisma/prisma.module";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { CategoryModule } from "./category/category.module";
import { CloudinaryService } from "./cloudinary.service";
import { ImageController } from "./image.controller";
import { PostsModule } from "./posts/posts.module";
import { TasksModule } from "./tasks/tasks.module";
import { UsersModule } from "./users/users.module";
import { HashtagsModule } from './hashtags/hashtags.module';
import { LikesModule } from './likes/likes.module';
import { CommentsModule } from './comments/comments.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MulterModule.register(),
    TasksModule,
    PrismaModule,
    UsersModule,
    AuthModule,
    CategoryModule,
    PostsModule,
    HashtagsModule,
    LikesModule,
    CommentsModule,
  ],
  controllers: [AppController, ImageController],
  providers: [AppService, CloudinaryService],
})
export class AppModule {}
