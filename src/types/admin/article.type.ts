export type ArticleStatus = "DRAFT" | "PUBLISHED" | "DELETED";

export interface ArticleResponse {
  id: string;

  title: string;
  description: string;

  slug: string;
  content: string;

  thumbnailUrl: string;

  // author
  authorId: string;
  authorName: string;
  authorPosition: string;
  authorAvatar: string;

  // category
  categoryId: string;
  categoryName: string;

  status: ArticleStatus;

  createdAt: string;
  updatedAt: string;
}

export interface ArticlePayload {
  title: string;

  slug?: string;

  content: string;

  authorId: string;
  categoryId: string;

  status?: ArticleStatus;

  thumbnailFile?: File | null;
}

export interface ArticleSearchRequest {
  keyword?: string;

  authorId?: string;
  categoryId?: string;

  status?: ArticleStatus;

  page?: number;
  size?: number;

  sortBy?: string;
  sortDir?: "asc" | "desc";
}

export interface UpdateArticleStatusPayload {
  status: ArticleStatus;
}
