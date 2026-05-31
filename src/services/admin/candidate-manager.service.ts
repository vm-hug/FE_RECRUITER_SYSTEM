import axiosClient from "../../api/axiosClient";

import type { PageResponse } from "../../types/common.type";

import type {
  CandidateResponseManager,
  CandidateSearchRequest,
  UpdateCandidateStatusPayload,
} from "../../types/admin/candidate-manager.type";

export const candidateManagerServices = {
  search: async (
    params: CandidateSearchRequest,
  ): Promise<PageResponse<CandidateResponseManager>> => {
    return axiosClient.get("/admin/candidate", {
      params,
    }) as Promise<PageResponse<CandidateResponseManager>>;
  },

  getById: async (id: string): Promise<CandidateResponseManager> => {
    return axiosClient.get(
      `/admin/candidate/${id}`,
    ) as Promise<CandidateResponseManager>;
  },

  updateStatus: async (
    id: string,
    data: UpdateCandidateStatusPayload,
  ): Promise<CandidateResponseManager> => {
    return axiosClient.patch(
      `/admin/candidate/${id}/status`,
      data,
    ) as Promise<CandidateResponseManager>;
  },
};
