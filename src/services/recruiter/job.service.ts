import axiosClient from "../../api/axiosClient";

import type { PageResponse } from "../../types/common.type";

import type {
  JobPayload,
  JobResponse,
  JobSearchParams,
  UpdateJobStatusPayload,
} from "../../types/recruiter/job.type";

const buildFormData = (data: JobPayload): FormData => {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      formData.append(key, value as string | Blob);
    }
  });

  return formData;
};

const cleanParams = (params: JobSearchParams): JobSearchParams => {
  return Object.fromEntries(
    Object.entries(params).filter(
      ([_, value]) => value !== undefined && value !== null && value !== "",
    ),
  );
};

export const jobServices = {
  create: async (data: JobPayload): Promise<JobResponse> => {
    const formData = buildFormData(data);

    return axiosClient.post("/jobs", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }) as Promise<JobResponse>;
  },

  update: async (id: string, data: JobPayload): Promise<JobResponse> => {
    const formData = buildFormData(data);

    return axiosClient.put(`/jobs/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }) as Promise<JobResponse>;
  },

  updateJobStatus: async (
    id: string,
    payload: UpdateJobStatusPayload,
  ): Promise<JobResponse> => {
    return axiosClient.patch(
      `/jobs/${id}/status`,
      payload,
    ) as Promise<JobResponse>;
  },

  getBySlug: async (slug: string): Promise<JobResponse> => {
    return axiosClient.get(`/jobs/slug/${slug}`) as Promise<JobResponse>;
  },

  getById: async (id: string): Promise<JobResponse> => {
    return axiosClient.get(`/jobs/${id}`) as Promise<JobResponse>;
  },

  search: async (
    params: JobSearchParams,
  ): Promise<PageResponse<JobResponse>> => {
    return axiosClient.get("/jobs/search", {
      params: cleanParams(params),
    }) as Promise<PageResponse<JobResponse>>;
  },

  searchByRecruiter: async (
    params: JobSearchParams,
  ): Promise<PageResponse<JobResponse>> => {
    return axiosClient.get("/jobs/search/my-jobs", {
      params: cleanParams(params),
    }) as Promise<PageResponse<JobResponse>>;
  },

  delete: async (id: string): Promise<void> => {
    return axiosClient.delete(`/jobs/${id}`) as Promise<void>;
  },
};
