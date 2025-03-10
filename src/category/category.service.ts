import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { Category } from "@prisma/client";
import { PrismaService } from "prisma/prisma.service";
import { CreateCategoryDto } from "./dtos/create-category.dto";

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

  async getAll() {
    return await this.prisma.category.findMany();
  }

  async create({ title }: CreateCategoryDto, userId: number) {
    const findByTitle = await this.prisma.category.findUnique({ where: { title } });

    if (findByTitle) {
      throw new ConflictException("Category with this title is already existing");
    }

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

  async delete(id: number) {
    const category = await this.getOneOrThrow(id);

    if (category.publish) {
      throw new ConflictException("Cannot delete a published category. Please unpublish it first.");
    }

    const deletedCategory = await this.prisma.category.delete({
      where: { id },
    });

    return deletedCategory;
  }

  async getOneOrThrow(id: number): Promise<Category> {
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
      .normalize("NFKD") // Use NFKD to split combined characters
      .replace(/ /g, "-") // Replace spaces with hyphens
      .replace(/[^\p{L}\p{N}\u0980-\u09FF-]+/gu, ""); // Allow Bangla Unicode range

    return slug;
  }
}
