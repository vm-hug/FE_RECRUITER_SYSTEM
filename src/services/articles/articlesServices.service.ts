import axiosClient from "../../api/axiosClient";
import type {
  ArticlePayload,
  ArticleResponse,
  ArticleSearchParams,
} from "../../types/articles/articles.type";
import type { PageResponse } from "../../types/common.type";

const buildFormData = (data: ArticlePayload): FormData => {
  const formData = new FormData();
  formData.append("title", data.title);
  if (data.slug) formData.append("slug", data.slug);
  formData.append("content", data.content);
  formData.append("authorId", data.authorId);
  formData.append("categoryId", data.categoryId);
  if (data.status) formData.append("status", data.status);
  if (data.thumbnailFile) {
    formData.append("thumbnailFile", data.thumbnailFile);
  }
  return formData;
};

export const articleService = {
  create: (data: ArticlePayload): Promise<ArticleResponse> => {
    const formData = buildFormData(data);
    return axiosClient.post("/articles", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }) as Promise<ArticleResponse>;
  },

  update: (id: string, data: ArticlePayload): Promise<ArticleResponse> => {
    const formData = buildFormData(data);
    return axiosClient.put(`/articles/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }) as Promise<ArticleResponse>;
  },

  getById: (id: string): Promise<ArticleResponse> => {
    return axiosClient.get(`/articles/${id}`) as Promise<ArticleResponse>;
  },

  getBySlug: (slug: string): Promise<ArticleResponse> => {
    return axiosClient.get(
      `/articles/slug/${slug}`,
    ) as Promise<ArticleResponse>;
  },

  search: (
    params: ArticleSearchParams,
  ): Promise<PageResponse<ArticleResponse>> => {
    return axiosClient.get("/articles/search", { params }) as Promise<
      PageResponse<ArticleResponse>
    >;
  },

  delete: (id: string): Promise<void> => {
    return axiosClient.delete(`/articles/${id}`) as Promise<void>;
  },
};
