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
import { TasksModule } from "./tasks/tasks.module";
import { UsersModule } from "./users/users.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MulterModule.register({ dest: "./uploads" }),
    TasksModule,
    PrismaModule,
    UsersModule,
    AuthModule,
    CategoryModule,
  ],
  controllers: [AppController, ImageController],
  providers: [AppService, CloudinaryService],
})
export class AppModule {}
