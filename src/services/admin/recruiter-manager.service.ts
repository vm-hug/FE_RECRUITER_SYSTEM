import axiosClient from "../../api/axiosClient";
import type {
  RecruiterResponse,
  RecruiterSearchRequest,
} from "../../types/admin/recruiter-manager.type";
import type { UserResponse } from "../../types/candidate/candidate.type";

import type { PageResponse } from "../../types/common.type";

export const recruiterManagerServices = {
  search: async (
    params: RecruiterSearchRequest,
  ): Promise<PageResponse<RecruiterResponse>> => {
    return axiosClient.get("/admin/recruiter", {
      params,
    }) as Promise<PageResponse<RecruiterResponse>>;
  },

  getById: async (id: string): Promise<RecruiterResponse> => {
    return axiosClient.get(
      `/admin/recruiter/${id}`,
    ) as Promise<RecruiterResponse>;
  },

  approveRecruiter: async (id: string): Promise<UserResponse> => {
    return axiosClient.patch(
      `/admin/recruiter/${id}/approve`,
    ) as Promise<UserResponse>;
  },
};
