export interface ArticlePayload {
  title: string;
  slug?: string; // có thể không nhập
  content: string;
  authorId: string;
  categoryId: string;
  status?: "DRAFT" | "PUBLISHED" | "DELETED";
  thumbnailFile?: File | null;
}

export interface ArticleSearchParams {
  keyword?: string;
  authorId?: string;
  categoryId?: string;
  status?: string;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: string;
}

export interface ArticleResponse {
  id: string;
  title: string;
  description: string;
  slug: string;
  content: string;
  thumbnailUrl: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  categoryId: string;
  categoryName: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}
