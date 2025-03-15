import { Injectable, NotFoundException } from "@nestjs/common";
import { Post } from "@prisma/client";
import { PrismaService } from "prisma/prisma.service";
import { CategoryService } from "src/category/category.service";
import { CloudinaryService } from "src/cloudinary.service";
import { HashtagsService } from "src/hashtags/hashtags.service";
import { CreatePostDto } from "./dtos/create-post.dto";

@Injectable()
export class PostsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinaryService: CloudinaryService,
    private readonly hashtagsService: HashtagsService,
    private readonly categoryService: CategoryService,
  ) {}
  async create({ content, categoryId, hashTag }: CreatePostDto, file: Express.Multer.File, authorId: number) {
    let hashtagId;
    if (hashTag) {
      hashtagId = await this.hashtagsService.findOrCreate(hashTag, authorId);
    }

    const category = await this.categoryService.getOneOrThrow(categoryId);

    let imageUrl = null;

    if (file) {
      const img = await this.cloudinaryService.uploadImage(file.buffer, file.originalname);
      imageUrl = img.secure_url;
    }

    const createdPost = await this.prisma.post.create({
      data: {
        content,
        photo: imageUrl,
        authorId,
        categoryId: category.id,
        hashTagId: hashtagId,
      },
    });

    return createdPost;
  }

  async getAll(take: number = 10, skip: number = 0, search?: string) {
    return await this.prisma.post.findMany({
      take,
      skip,
      where: {
        content: {
          contains: search,
        },
      },
    });
  }

  async update(
    postId: number,
    { content, categoryId, hashTag }: CreatePostDto,
    file: Express.Multer.File,
    authorId: number,
  ) {
    const existingPost = await this.getOneOrThrow(postId, authorId);

    let hashtagId;
    if (hashTag) {
      hashtagId = await this.hashtagsService.findOrCreate(hashTag, authorId);
    }

    const category = await this.categoryService.getOneOrThrow(categoryId);

    let imageUrl = existingPost.photo;

    if (file) {
      const img = await this.cloudinaryService.uploadImage(file.buffer, file.originalname);
      imageUrl = img.secure_url;
    }

    const updatedPost = await this.prisma.post.update({
      where: { id: postId },
      data: {
        content,
        photo: imageUrl,
        categoryId: category.id,
        hashTagId: hashtagId,
      },
    });

    return updatedPost;
  }

  async delete(postId: number, authorId: number) {
    await this.getOneOrThrow(postId, authorId);

    const deletedPost = await this.prisma.post.delete({ where: { id: postId, authorId } });

    return deletedPost;
  }

  async getOneOrThrow(postId: number, authorId: number): Promise<Post> {
    const post = await this.prisma.post.findUnique({ where: { id: postId, authorId } });
    if (!post) {
      throw new NotFoundException("Post not found");
    }

    return post;
  }
}
