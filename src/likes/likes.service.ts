import { Injectable, NotFoundException } from "@nestjs/common";
import { Post } from "@prisma/client";
import { PrismaService } from "prisma/prisma.service";

@Injectable()
export class LikesService {
  constructor(private readonly prisma: PrismaService) {}

  async toggleLike(postId: number, authorId: number) {
    await this.getOneOrThrow(postId);

    const like = await this.prisma.like.findFirst({
      where: {
        postId,
        userId: authorId,
      },
    });

    if (like) {
      await this.prisma.like.delete({
        where: {
          id: like.id,
        },
      });
      return false;
    }

    await this.prisma.like.create({
      data: {
        postId,
        userId: authorId,
      },
    });

    return true;
  }

  async getLikes(postId: number) {
    await this.getOneOrThrow(postId);

    const count = await this.prisma.like.count({
      where: {
        postId,
      },
    });

    const likes = await this.prisma.like.findMany({
      where: {
        postId,
      },
    });

    return {
      count,
      likes,
    };
  }

  async getOneOrThrow(postId: number): Promise<Post> {
    const post = await this.prisma.post.findUnique({
      where: {
        id: postId,
      },
    });
    if (!post) {
      throw new NotFoundException("Post not found");
    }
    return post;
  }
}
