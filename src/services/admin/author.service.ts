import axiosClient from "../../api/axiosClient";

import type { PageResponse } from "../../types/common.type";

import type {
  AuthorPayload,
  AuthorResponse,
  AuthorSearchRequest,
} from "../../types/admin/author.type";

export const authorServices = {
  create: async (data: AuthorPayload): Promise<AuthorResponse> => {
    const formData = new FormData();

    appendAuthorFormData(formData, data);

    return axiosClient.post("/authors", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }) as Promise<AuthorResponse>;
  },

  getAll: async (
    params: AuthorSearchRequest,
  ): Promise<PageResponse<AuthorResponse>> => {
    return axiosClient.get("/authors", {
      params,
    }) as Promise<PageResponse<AuthorResponse>>;
  },

  getById: async (id: string): Promise<AuthorResponse> => {
    return axiosClient.get(`/authors/${id}`) as Promise<AuthorResponse>;
  },

  update: async (id: string, data: AuthorPayload): Promise<AuthorResponse> => {
    const formData = new FormData();

    appendAuthorFormData(formData, data);

    return axiosClient.put(`/authors/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }) as Promise<AuthorResponse>;
  },

  delete: async (id: string): Promise<void> => {
    return axiosClient.delete(`/authors/${id}`) as Promise<void>;
  },
};

function appendAuthorFormData(formData: FormData, data: AuthorPayload) {
  formData.append("name", data.name);

  formData.append("position", data.position);

  if (data.avatarUrl) {
    formData.append("avatarUrl", data.avatarUrl);
  }
}
