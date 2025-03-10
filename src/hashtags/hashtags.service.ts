import { Injectable } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";

@Injectable()
export class HashtagsService {
  constructor(private readonly prisma: PrismaService) {}

  async findOrCreate(title: string, authorId: number) {
    const titleLower = title.toLowerCase();
    const slug = this.getSlug(titleLower);

    let hashtag = await this.prisma.hashTag.findUnique({ where: { title: titleLower, slug: slug } });

    if (!hashtag) {
      hashtag = await this.prisma.hashTag.create({ data: { title: titleLower, slug, authorId } });
    }
    return hashtag.id;
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
