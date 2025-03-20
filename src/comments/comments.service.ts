import { Injectable, NotFoundException } from "@nestjs/common";
import { Post } from "@prisma/client";
import { PrismaService } from "prisma/prisma.service";
import { CreateCommentDto } from "./dtos/create-comment.dto";

@Injectable()
export class CommentsService {
  constructor(private readonly prisma: PrismaService) {}

  async getComments(postId: number) {
    await this.getOneOrThrow(postId);

    const count = await this.prisma.comment.count({ where: { postId } });

    const comments = await this.prisma.comment.findMany({
      where: {
        postId,
      },
    });

    return { count, comments };
  }

  async createComment(postId: number, authorId: number, { content }: CreateCommentDto) {
    await this.getOneOrThrow(postId);

    const comment = await this.prisma.comment.create({
      data: {
        content,
        postId,
        userId: authorId,
      },
    });

    return comment;
  }

  async updateComment(postId: number, commentId: number, authorId: number, { content }: CreateCommentDto) {
    await this.getOneOrThrow(postId);

    const comment = await this.prisma.comment.findFirst({
      where: {
        id: commentId,
        postId,
        userId: authorId,
      },
    });

    if (!comment) {
      throw new NotFoundException("Comment not found");
    }

    const updatedComment = await this.prisma.comment.update({
      where: {
        id: commentId,
      },
      data: {
        content,
      },
    });

    return updatedComment;
  }

  async deleteComment(postId: number, commentId: number, authorId: number) {
    await this.getOneOrThrow(postId);

    const comment = await this.prisma.comment.findFirst({
      where: {
        id: commentId,
        postId,
        userId: authorId,
      },
    });

    if (!comment) {
      throw new NotFoundException("Comment not found");
    }

    const deletedComment = await this.prisma.comment.delete({
      where: {
        id: commentId,
      },
    });

    return deletedComment;
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
