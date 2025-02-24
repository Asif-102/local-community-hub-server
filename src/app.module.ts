import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { PrismaModule } from "prisma/prisma.module";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { TasksModule } from "./tasks/tasks.module";
import { UsersModule } from "./users/users.module";
import { CategoryModule } from './category/category.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), TasksModule, PrismaModule, UsersModule, AuthModule, CategoryModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
