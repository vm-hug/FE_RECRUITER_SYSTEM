import axiosClient from "../../api/axiosClient";
import type {
  JobPayload,
  JobResponse,
  JobSearchParams,
  PageResponse,
} from "../../types/recruiter/job.type";

const buildFormData = (data: JobPayload): FormData => {
  const formData = new FormData();

  formData.append("jobCode", data.jobCode);
  formData.append("title", data.title);
  formData.append("slug", data.slug);
  formData.append("professionId", data.professionId);
  formData.append("description", data.description);
  formData.append("requirements", data.requirements);
  formData.append("experience", data.experience);
  formData.append("levelId", data.levelId);
  formData.append("educationLevelId", data.educationLevelId);
  formData.append("workFormatId", data.workFormatId);
  formData.append("salaryMin", data.salaryMin.toString());
  formData.append("salaryMax", data.salaryMax.toString());
  formData.append("moneyCurrent", data.moneyCurrent);
  formData.append("jobStatus", data.jobStatus);
  formData.append("contactEmail", data.contactEmail);
  formData.append("gpa", data.gpa.toString());
  formData.append("expiredAt", data.expiredAt);

  if (data.avatarJob) {
    formData.append("avatarJob", data.avatarJob);
  }

  return formData;
};

export const jobServices = {
  create: (data: JobPayload): Promise<JobResponse> => {
    const formData = buildFormData(data);
    return axiosClient.post("/jobs", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }) as Promise<JobResponse>;
  },

  update: (id: string, data: JobPayload): Promise<JobResponse> => {
    const formData = buildFormData(data);
    return axiosClient.put(`/jobs/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }) as Promise<JobResponse>;
  },

  getBySlug: (slug: string): Promise<JobResponse> => {
    return axiosClient.get(`/jobs/slug/${slug}`) as Promise<JobResponse>;
  },

  getById: (id: string): Promise<JobResponse> => {
    return axiosClient.get(`/jobs/${id}`) as Promise<JobResponse>;
  },

  search: (params: JobSearchParams): Promise<PageResponse<JobResponse>> => {
    const cleanedParams = Object.fromEntries(
      Object.entries(params).filter(
        ([_, value]) => value !== "" && value !== null && value !== undefined,
      ),
    );
    return axiosClient.get("/jobs/search", {
      params: cleanedParams,
    }) as Promise<PageResponse<JobResponse>>;
  },

  searchByRecruiter: (
    params: JobSearchParams,
  ): Promise<PageResponse<JobResponse>> => {
    const cleanedParams = Object.fromEntries(
      Object.entries(params).filter(
        ([_, value]) => value !== "" && value !== null && value !== undefined,
      ),
    );
    return axiosClient.get("/jobs/search/my-jobs", {
      params: cleanedParams,
    }) as Promise<PageResponse<JobResponse>>;
  },

  delete: (id: string): Promise<void> => {
    return axiosClient.delete(`/jobs/${id}`) as Promise<void>;
  },
};
