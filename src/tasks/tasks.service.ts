import { Injectable, NotFoundException } from "@nestjs/common";
import { Task } from "@prisma/client";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateTaskDto } from "./dtos/create-task.dto";
import { UpdateTaskDto } from "./dtos/update-task.dto";

@Injectable()
export class TasksService {
  constructor(private readonly prismaService: PrismaService) {}

  async get(userId: number) {
    return await this.prismaService.task.findMany({
      where: { userId },
    });
  }

  async createOne({ title, description }: CreateTaskDto, userId: number): Promise<Task> {
    const task = await this.prismaService.task.create({
      data: {
        title,
        description,
        userId,
      },
    });

    return task;
  }

  async updateOne(id: number, dto: UpdateTaskDto, userId: number) {
    await this.getOneOrThrow(id, userId);

    const updatedTask = await this.prismaService.task.update({
      where: { id, userId },
      data: dto,
    });

    return updatedTask;
  }

  async deleteOne(id: number, userId: number) {
    await this.getOneOrThrow(id, userId);

    const deletedTask = await this.prismaService.task.delete({
      where: { id, userId },
    });

    return deletedTask;
  }

  // Private methods
  private async getOneOrThrow(id: number, userId: number): Promise<Task> {
    const task = await this.prismaService.task.findUnique({ where: { id } });

    if (!task) {
      throw new NotFoundException("Could not find any task");
    }

    return task;
  }
}
