import axiosClient from "../../../api/axiosClient";
import type {
  CategoryArticlePayload,
  CategoryArticleResponse,
} from "../../../types/articles/categoryArticle/category.type";

export const categoryArticleService = {
  create: (data: CategoryArticlePayload): Promise<CategoryArticleResponse> => {
    return axiosClient.post(
      "/category_articles",
      data,
    ) as Promise<CategoryArticleResponse>;
  },
  getAll: (): Promise<CategoryArticleResponse[]> => {
    return axiosClient.get("/category_articles") as Promise<
      CategoryArticleResponse[]
    >;
  },

  getById: (id: string): Promise<CategoryArticleResponse> => {
    return axiosClient.get(
      `/category_articles/${id}`,
    ) as Promise<CategoryArticleResponse>;
  },

  update: (
    id: string,
    data: CategoryArticlePayload,
  ): Promise<CategoryArticleResponse> => {
    return axiosClient.put(
      `/category_articles/${id}`,
      data,
    ) as Promise<CategoryArticleResponse>;
  },

  delete: (id: string): Promise<void> => {
    return axiosClient.delete(`/category_articles/${id}`) as Promise<void>;
  },
};
