import axiosClient from "../../api/axiosClient";
import type { WorkExperience } from "../../types/candidate/candidate.type";

const workExperienceService = {
  getMyExperiences: (): Promise<WorkExperience[]> =>
    axiosClient.get("/work-experience/me"),

  getById: (id: string): Promise<WorkExperience> =>
    axiosClient.get(`/work-experience/${id}`),

  create: (data: Omit<WorkExperience, "id">): Promise<WorkExperience> =>
    axiosClient.post("/work-experience", data),

  update: (
    id: string,
    data: Partial<WorkExperience>,
  ): Promise<WorkExperience> => axiosClient.put(`/work-experience/${id}`, data),

  delete: (id: string): Promise<void> =>
    axiosClient.delete(`/work-experience/${id}`),
};

export default workExperienceService;
