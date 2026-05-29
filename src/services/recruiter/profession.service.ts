import axiosClient from "../../api/axiosClient";
import type { PageResponse } from "../../types/common.type";
import type {
  ProfessionRequest,
  ProfessionResponse,
  ProfessionSearch,
} from "../../types/recruiter/profession.type";

export const professionServices = {
  // Tạo mới (gửi JSON)
  create: (data: ProfessionRequest): Promise<ProfessionResponse> => {
    return axiosClient.post("/profession", data) as Promise<ProfessionResponse>;
  },

  // Cập nhật (gửi JSON)
  update: (
    id: string,
    data: ProfessionRequest,
  ): Promise<ProfessionResponse> => {
    return axiosClient.put(
      `/profession/${id}`,
      data,
    ) as Promise<ProfessionResponse>;
  },

  getAll: (
    params: ProfessionSearch,
  ): Promise<PageResponse<ProfessionResponse>> => {
    return axiosClient.get("/profession/search", { params }) as Promise<
      PageResponse<ProfessionResponse>
    >;
  },

  getById: (id: string): Promise<ProfessionResponse> => {
    return axiosClient.get(`/profession/${id}`) as Promise<ProfessionResponse>;
  },

  delete: (id: string): Promise<void> => {
    return axiosClient.delete(`/profession/${id}`) as Promise<void>;
  },
};
