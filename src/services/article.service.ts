import { prisma } from "@/lib/prisma";

export type GetArticlesOptions = {
  publishedOnly?: boolean;
  limit?: number;
};

export class ArticleService {
  static async getArticles(options: GetArticlesOptions = {}) {
    return prisma.article.findMany({
      where: options.publishedOnly ? { published: true } : undefined,
      orderBy: { createdAt: "desc" },
      take: options.limit,
    });
  }

  static async getArticleBySlug(slug: string) {
    return prisma.article.findUnique({
      where: { slug },
    });
  }

  static async getArticleById(id: string) {
    return prisma.article.findUnique({
      where: { id },
    });
  }

  static async createArticle(data: {
    title: string;
    slug: string;
    description?: string;
    content: string;
    image?: string;
    published?: boolean;
  }) {
    return prisma.article.create({
      data,
    });
  }

  static async updateArticle(
    id: string,
    data: {
      title?: string;
      slug?: string;
      description?: string;
      content?: string;
      image?: string;
      published?: boolean;
    }
  ) {
    return prisma.article.update({
      where: { id },
      data,
    });
  }

  static async deleteArticle(id: string) {
    return prisma.article.delete({
      where: { id },
    });
  }
}
