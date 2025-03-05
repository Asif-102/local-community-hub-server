import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
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

    const img = await this.cloudinaryService.uploadImage(file.buffer, file.originalname);

    const createdPost = await this.prisma.post.create({
      data: {
        content,
        photo: img.secure_url,
        authorId,
        categoryId: category.id,
        hashTagId: hashtagId,
      },
    });

    return createdPost;
  }

  async delete(postId: number, authorId: number) {
    await this.getOneOrThrow(postId);

    const post = await this.prisma.post.findUnique({
      where: { id: postId, authorId },
    });

    if (!post) {
      throw new BadRequestException("This is not your post");
    }

    const deletedPost = await this.prisma.post.delete({ where: { id: postId, authorId } });

    return deletedPost;
  }

  async getOneOrThrow(postId: number): Promise<Post> {
    const post = await this.prisma.post.findUnique({ where: { id: postId } });
    if (!post) {
      throw new NotFoundException("Post not found");
    }
    return post;
  }
}
