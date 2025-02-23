import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from "@nestjs/common";
import { Task } from "@prisma/client";
import { Roles } from "src/auth/decorators/roles.decorator";
import { Role } from "src/auth/enums/role.enum";
import { JwtAccessGuard } from "src/auth/guards/jwt-access.guard";
import { RolesGuard } from "src/auth/guards/roles/roles.guard";
import { CurrentUser } from "src/utils/decorators/current-user.decorator";
import { CreateTaskDto } from "./dtos/create-task.dto";
import { UpdateTaskDto } from "./dtos/update-task.dto";
import { TasksService } from "./tasks.service";

@UseGuards(RolesGuard)
@UseGuards(JwtAccessGuard)
@Controller("tasks")
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  // @SetMetadata("role", [Role.USER])
  @Roles(Role.USER)
  // @UseGuards(RolesGuard)
  // @UseGuards(JwtAccessGuard)
  @Get()
  get(@CurrentUser("id", ParseIntPipe) userId: number) {
    return this.tasksService.get(userId);
  }

  @Post()
  createOne(@Body() dto: CreateTaskDto, @CurrentUser("id", ParseIntPipe) userId: number): Promise<Task> {
    return this.tasksService.createOne(dto, userId);
  }

  @Patch(":id")
  updateOne(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: UpdateTaskDto,
    @CurrentUser("id", ParseIntPipe) userId: number,
  ) {
    return this.tasksService.updateOne(id, dto, userId);
  }

  @Delete(":id")
  deleteOne(@Param("id", ParseIntPipe) id: number, @CurrentUser("id", ParseIntPipe) userId: number) {
    return this.tasksService.deleteOne(id, userId);
  }
}
