import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from "@nestjs/common";
import { Task } from "@prisma/client";
import { CreateTaskDto } from "./dtos/create-task.dto";
import { UpdateTaskDto } from "./dtos/update-task.dto";
import { TasksService } from "./tasks.service";

@Controller("tasks")
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  get() {
    return this.tasksService.get();
  }

  @Post()
  async createOne(@Body() dto: CreateTaskDto): Promise<Task> {
    return await this.tasksService.createOne(dto);
  }

  @Patch(":id")
  updateOne(@Param("id", ParseIntPipe) id: number, @Body() dto: UpdateTaskDto) {
    return this.tasksService.updateOne(id, dto);
  }

  @Delete(":id")
  deleteOne(@Param("id", ParseIntPipe) id: number) {
    return this.tasksService.deleteOne(id);
  }
}
