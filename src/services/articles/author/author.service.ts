import axiosClient from "../../../api/axiosClient";
import type {
  AuthorPayload,
  AuthorResponse,
} from "../../../types/articles/author/author.type";

const buildFormData = (data: AuthorPayload): FormData => {
  const formData = new FormData();
  formData.append("name", data.name);
  if (data.avatarUrl) {
    formData.append("avatarUrl", data.avatarUrl);
  }
  return formData;
};

export const authorService = {
  create: (data: AuthorPayload): Promise<AuthorResponse> => {
    const formData = buildFormData(data);
    return axiosClient.post("/authors", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }) as Promise<AuthorResponse>;
  },

  getAll: (): Promise<AuthorResponse[]> => {
    return axiosClient.get("/authors") as Promise<AuthorResponse[]>;
  },

  getById: (id: string): Promise<AuthorResponse> => {
    return axiosClient.get(`/authors/${id}`) as Promise<AuthorResponse>;
  },

  update: (id: string, data: AuthorPayload): Promise<AuthorResponse> => {
    const formData = buildFormData(data);
    return axiosClient.put(`/authors/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }) as Promise<AuthorResponse>;
  },

  delete: (id: string): Promise<void> => {
    return axiosClient.delete(`/authors/${id}`) as Promise<void>;
  },
};
