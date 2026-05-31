import axiosClient from "../../api/axiosClient";
import type {
  ArticlePayload,
  ArticleResponse,
  ArticleSearchRequest,
  UpdateArticleStatusPayload,
} from "../../types/admin/article.type";

import type { PageResponse } from "../../types/common.type";

export const articleServices = {
  create: async (data: ArticlePayload): Promise<ArticleResponse> => {
    const formData = new FormData();

    appendArticleFormData(formData, data);

    return axiosClient.post("/articles", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }) as Promise<ArticleResponse>;
  },

  update: async (
    id: string,
    data: ArticlePayload,
  ): Promise<ArticleResponse> => {
    const formData = new FormData();

    appendArticleFormData(formData, data);

    return axiosClient.put(`/articles/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }) as Promise<ArticleResponse>;
  },

  updateStatus: async (
    id: string,
    data: UpdateArticleStatusPayload,
  ): Promise<ArticleResponse> => {
    return axiosClient.patch(
      `/articles/${id}/status`,
      data,
    ) as Promise<ArticleResponse>;
  },

  getById: async (id: string): Promise<ArticleResponse> => {
    return axiosClient.get(`/articles/${id}`) as Promise<ArticleResponse>;
  },

  getBySlug: async (slug: string): Promise<ArticleResponse> => {
    return axiosClient.get(
      `/articles/slug/${slug}`,
    ) as Promise<ArticleResponse>;
  },

  search: async (
    params: ArticleSearchRequest,
  ): Promise<PageResponse<ArticleResponse>> => {
    return axiosClient.get("/articles/search", {
      params,
    }) as Promise<PageResponse<ArticleResponse>>;
  },

  delete: async (id: string): Promise<void> => {
    return axiosClient.delete(`/articles/${id}`) as Promise<void>;
  },
};

function appendArticleFormData(formData: FormData, data: ArticlePayload) {
  formData.append("title", data.title);

  if (data.slug) {
    formData.append("slug", data.slug);
  }

  formData.append("content", data.content);

  formData.append("authorId", data.authorId);

  formData.append("categoryId", data.categoryId);

  if (data.status) {
    formData.append("status", data.status);
  }

  if (data.thumbnailFile) {
    formData.append("thumbnailFile", data.thumbnailFile);
  }
}
