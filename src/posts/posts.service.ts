import { Injectable } from "@nestjs/common";
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
    // img.secure_url

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
}
