import { Injectable, NotFoundException } from "@nestjs/common";
import { Category } from "@prisma/client";
import { PrismaService } from "prisma/prisma.service";
import { CreateCategoryDto } from "./dtos/create-category.dto";

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

  async create({ title }: CreateCategoryDto, userId: number) {
    const category = await this.prisma.category.create({
      data: {
        title,
        slug: this.getSlug(title),
        authorId: userId,
      },
    });
    return category;
  }

  async update(id: number, { title }: CreateCategoryDto) {
    await this.getOneOrThrow(id);

    const updatedCategory = await this.prisma.category.update({
      where: { id },
      data: {
        title,
        slug: this.getSlug(title),
      },
    });

    return updatedCategory;
  }

  async changeStatus(id: number) {
    const category = await this.getOneOrThrow(id);

    const changedStatus = await this.prisma.category.update({
      where: { id },
      data: {
        publish: !category.publish,
      },
    });

    return changedStatus;
  }

  private async getOneOrThrow(id: number): Promise<Category> {
    const category = await this.prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException("Could not find category");
    }
    return category;
  }

  getSlug(title: string) {
    if (!title) return null;

    const slug = title
      .toLowerCase()
      .replace(/ /g, "-")
      .replace(/[^\w-]+/g, "");

    return slug;
  }
}
